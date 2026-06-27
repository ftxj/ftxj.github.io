const Route2D = (() => {
  const colors = { red: '#dc2626', orange: '#f97316', blue: '#2563eb', purple: '#7c3aed' };
  const kindLabels = {
    all: '全部', terminal: '起终点', camp: '营地', pass: '垭口/山脊',
    water: '湖泊/水源', glacier: '冰川', peak: '雪山', risk: '风险', poi: '其它'
  };

  function fmt(n, unit = '') {
    return Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + unit;
  }

  function markerIcon(kind) {
    return L.divIcon({ className: '', html: `<div class="marker ${kind || 'poi'}"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] });
  }

  function routeSlice(route, fromKm, toKm) {
    return route.filter(p => p.dist_km >= fromKm && p.dist_km <= toKm).map(p => [p.lat, p.lon]);
  }

  function drawProfile(route, canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);
    const pad = 28;
    const eles = route.map(p => p.ele).filter(v => v != null);
    const minEle = Math.min(...eles);
    const maxEle = Math.max(...eles);
    const maxD = route[route.length - 1].dist_km;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.strokeStyle = '#e1d2b8';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = pad + i * (cssH - pad * 2) / 3;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(cssW - pad, y); ctx.stroke();
    }
    ctx.beginPath();
    route.forEach((p, i) => {
      const x = pad + (p.dist_km / maxD) * (cssW - pad * 2);
      const y = cssH - pad - ((p.ele - minEle) / (maxEle - minEle)) * (cssH - pad * 2);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#d9672b';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#231f1a';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${fmt(minEle, 'm')}`, 8, cssH - pad);
    ctx.fillText(`${fmt(maxEle, 'm')}`, 8, pad + 4);
    ctx.fillText(`${maxD.toFixed(1)} km`, cssW - 74, cssH - 8);
  }

  function init(options) {
    fetch(options.dataUrl || 'route.json')
      .then(r => r.json())
      .then(data => {
        document.title = `${data.title} · 交互路书`;
        document.querySelector('[data-route-title]').textContent = data.title;
        document.querySelector('[data-route-subtitle]').textContent = data.subtitle || 'KML 轨迹交互预览';
        document.querySelector('[data-route-stats]').innerHTML = [
          ['距离', `${data.stats.distance_km} km`],
          ['累计爬升', `${fmt(data.stats.ascent_m)} m`],
          ['累计下降', `${fmt(data.stats.descent_m)} m`],
          ['海拔范围', `${fmt(data.stats.min_ele_m)}–${fmt(data.stats.max_ele_m)} m`],
          ['数据', 'KML 轨迹']
        ].map(([k, v]) => `<div class="route-stat"><b>${v}</b><span>${k}</span></div>`).join('');

        const map = L.map(options.mapId || 'map', { scrollWheelZoom: true });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const full = L.polyline(data.route.map(p => [p.lat, p.lon]), { color: '#6b7280', weight: 3, opacity: .35 }).addTo(map);
        data.segments.forEach(seg => {
          const pts = routeSlice(data.route, seg.from_km, seg.to_km);
          if (pts.length > 1) {
            L.polyline(pts, { color: colors[seg.color] || '#555', weight: 5, opacity: .95 })
              .addTo(map)
              .bindPopup(`<b>${seg.name}</b><br>${seg.type}<br>${seg.from_km}-${seg.to_km} km`);
          }
        });

        const allMarks = [...data.placemarks, ...data.landmarks];
        const markerByName = new Map();
        allMarks.forEach(pm => {
          const marker = L.marker([pm.lat, pm.lon], { icon: markerIcon(pm.kind) }).addTo(map)
            .bindPopup(`<b>${pm.name}</b><br>${kindLabels[pm.kind] || pm.kind || 'POI'}${pm.ele ? `<br>${fmt(pm.ele)} m` : ''}`);
          markerByName.set(pm.name, marker);
        });

        map.fitBounds(full.getBounds(), { padding: [24, 24] });
        const canvas = document.getElementById(options.profileId || 'profile');
        drawProfile(data.route, canvas);
        window.addEventListener('resize', () => drawProfile(data.route, canvas));

        const kinds = ['all', ...Array.from(new Set(allMarks.map(p => p.kind || 'poi'))).sort()];
        let active = 'all';
        const filters = document.getElementById(options.filtersId || 'filters');
        const poiList = document.getElementById(options.poiListId || 'poiList');

        function renderList() {
          filters.innerHTML = kinds.map(k => `<button class="${k === active ? 'active' : ''}" data-kind="${k}">${kindLabels[k] || k}</button>`).join('');
          poiList.innerHTML = allMarks
            .filter(p => active === 'all' || (p.kind || 'poi') === active)
            .slice(0, 80)
            .map(p => `<div class="route-poi" data-name="${p.name}"><b>${p.name}</b><span>${kindLabels[p.kind] || p.kind || 'POI'}${p.ele ? ` · ${fmt(p.ele)} m` : ''}</span></div>`)
            .join('');
        }
        filters.addEventListener('click', e => {
          const btn = e.target.closest('button[data-kind]');
          if (!btn) return;
          active = btn.dataset.kind;
          renderList();
        });
        poiList.addEventListener('click', e => {
          const item = e.target.closest('.route-poi[data-name]');
          if (!item) return;
          const marker = markerByName.get(item.dataset.name);
          if (marker) {
            map.setView(marker.getLatLng(), 12);
            marker.openPopup();
          }
        });
        renderList();
        document.getElementById(options.notesId || 'notes').innerHTML = data.notes.map(n => `<li>${n}</li>`).join('');
      });
  }

  return { init };
})();
