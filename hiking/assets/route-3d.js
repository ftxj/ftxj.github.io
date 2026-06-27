const Route3D = (() => {
  const segmentColors = {
    red: [220, 38, 38, 0.95],
    orange: [249, 115, 22, 0.95],
    blue: [37, 99, 235, 0.95],
    purple: [124, 58, 237, 0.95]
  };
  const kindColors = {
    terminal: [17, 24, 39, 1],
    camp: [22, 163, 74, 1],
    pass: [220, 38, 38, 1],
    water: [2, 132, 199, 1],
    glacier: [14, 165, 233, 1],
    risk: [124, 58, 237, 1],
    peak: [17, 24, 39, 1],
    poi: [100, 116, 139, 1]
  };

  function fmt(n) {
    return Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  }

  function routeSlice(route, fromKm, toKm) {
    return route
      .filter(p => p.dist_km >= fromKm && p.dist_km <= toKm)
      .map(p => [p.lon, p.lat, p.ele || 0]);
  }

  function init(options) {
    require([
      "esri/Map",
      "esri/views/SceneView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/widgets/ElevationProfile",
      "esri/widgets/Expand"
    ], function(Map, SceneView, Graphic, GraphicsLayer, ElevationProfile, Expand) {
      fetch(options.dataUrl || '../route.json')
        .then(r => r.json())
        .then(data => {
          document.title = `${data.title} · 3D 轨迹`;
          document.querySelector('[data-route-title]').textContent = data.title;
          document.querySelector('[data-route-meta]').innerHTML = [
            [`${data.stats.distance_km} km`, '距离'],
            [`${fmt(data.stats.ascent_m)} m`, '爬升'],
            [`${fmt(data.stats.max_ele_m)} m`, '最高']
          ].map(([v, k]) => `<div><b>${v}</b><span>${k}</span></div>`).join('');

          const map = new Map({ basemap: "hybrid", ground: "world-elevation" });
          const routeLayer = new GraphicsLayer({ title: "路线" });
          const poiLayer = new GraphicsLayer({ title: "关键点" });
          map.addMany([routeLayer, poiLayer]);

          data.segments.forEach(seg => {
            const path = routeSlice(data.route, seg.from_km, seg.to_km);
            if (path.length < 2) return;
            routeLayer.add(new Graphic({
              geometry: { type: "polyline", hasZ: true, paths: [path], spatialReference: { wkid: 4326 } },
              attributes: seg,
              symbol: {
                type: "line-3d",
                symbolLayers: [{ type: "line", material: { color: segmentColors[seg.color] || [217, 103, 43, .95] }, size: 6 }]
              },
              popupTemplate: { title: seg.name, content: `${seg.type}<br>${seg.from_km}-${seg.to_km} km` }
            }));
          });

          const mainPath = data.route.map(p => [p.lon, p.lat, p.ele || 0]);
          const mainGraphic = new Graphic({
            geometry: { type: "polyline", hasZ: true, paths: [mainPath], spatialReference: { wkid: 4326 } },
            symbol: {
              type: "line-3d",
              symbolLayers: [{ type: "line", material: { color: [35, 31, 26, .45] }, size: 2 }]
            }
          });
          routeLayer.add(mainGraphic);

          const allMarks = [...data.placemarks, ...data.landmarks];
          allMarks.forEach(pm => {
            const isPeak = pm.kind === 'peak';
            poiLayer.add(new Graphic({
              geometry: { type: "point", longitude: pm.lon, latitude: pm.lat, z: pm.ele || 0, spatialReference: { wkid: 4326 } },
              attributes: pm,
              symbol: {
                type: "point-3d",
                symbolLayers: [{
                  type: isPeak ? "object" : "icon",
                  resource: isPeak ? { primitive: "cone" } : { primitive: "circle" },
                  material: { color: kindColors[pm.kind] || kindColors.poi },
                  size: isPeak ? 160 : 18,
                  outline: { color: [255,255,255,.9], size: 1.5 }
                }],
                verticalOffset: { screenLength: isPeak ? 50 : 28, maxWorldLength: isPeak ? 600 : 220, minWorldLength: 20 },
                callout: { type: "line", color: [255,255,255,.7], size: 1 }
              },
              popupTemplate: { title: pm.name, content: `${pm.kind || 'POI'}${pm.ele ? `<br>${fmt(pm.ele)} m` : ''}` }
            }));
          });

          const view = new SceneView({
            container: options.viewId || "viewDiv",
            map,
            qualityProfile: "high",
            camera: options.camera || {
              position: { longitude: 101.85, latitude: 29.76, z: 22000 },
              tilt: 64,
              heading: 210
            },
            environment: {
              atmosphere: { quality: "high" },
              lighting: { directShadowsEnabled: true, ambientOcclusionEnabled: true }
            }
          });

          const profile = new ElevationProfile({
            view,
            input: mainGraphic,
            profiles: [{ type: "ground", color: "#d9672b" }],
            visibleElements: { legend: false, sketchButton: false, selectButton: false, settingsButton: false }
          });
          view.ui.add(new Expand({ view, content: profile, expanded: false, expandTooltip: "海拔剖面" }), "bottom-left");

          function flyToRoute() {
            view.goTo({ target: mainGraphic.geometry.extent.expand(1.7), tilt: 62, heading: 210 }, { duration: 1800 });
          }
          function flyToFinish() {
            const finish = allMarks.find(p => p.name.includes('子梅垭口') || p.name === '终点') || allMarks[0];
            if (!finish) return;
            view.goTo({
              position: { longitude: finish.lon - 0.025, latitude: finish.lat - 0.02, z: 7600 },
              tilt: 68,
              heading: 40
            }, { duration: 1800 });
          }

          document.getElementById('flyRoute').addEventListener('click', flyToRoute);
          document.getElementById('flyFinish').addEventListener('click', flyToFinish);
          document.getElementById('togglePanel').addEventListener('click', () => {
            const panel = document.getElementById('panel');
            const collapsed = panel.classList.toggle('collapsed');
            document.getElementById('togglePanel').textContent = collapsed ? '展开' : '收起';
          });
          view.when(() => {
            document.getElementById('loading').remove();
            flyToRoute();
          });
        })
        .catch(err => {
          document.getElementById('loading').textContent = '加载失败：' + err.message;
        });
    });
  }

  return { init };
})();
