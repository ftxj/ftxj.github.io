---
layout:
  - post
title: 在 Colab 上运行 TaiChi 图形应用
date: 2022-11-09 21:09:45
tags: 环境搭建
---

最近由于一些个人兴趣，想研究一下taichi系统。由于自己想要将一部分代码通过Colab共享出去，因此有了这篇探索。

主要的坑点在于，Colab 不能直接支持 taichi 的 GUI 系统。我自己并不像折腾什么 x11 forwaring 等技术，等有成熟的技术直接拿来用比较好。

因此，在没有 GUI 系统的前提下， taichi的运行结果直接保存为视频和gif，使用接口如下：

```[python]
result_dir = "./"
video_manager = ti.tools.VideoManager(output_dir=result_dir, framerate=24, automatic_build=False)
for i in range(500):
    paint()
    pixels_img = pixels.to_numpy()
    video_manager.write_frame(pixels_img)
    print(f'\rFrame {i+1}/50 is recorded', end='')
```

相对于的Cobal链接：https://colab.research.google.com/drive/1FZ9w8O0CGFiV4TNUP5OeNcurJg4zFjsC?usp=share_link

希望后续taichi社区可以一键导出GUI APP或者修复Colab上的GUI系统把。