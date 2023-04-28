---
title: >-
  [Paper Reading] Hyper-AP:Enhancing Associative Processing Through a Full-Stack
  Optimization
date: 2022-11-09 00:31:33
tags: 论文阅读
---

论文名称：Hyper-AP: Enhancing Associative Processing Through A Full-Stack Optimization

相关项目信息：https://li.seas.upenn.edu/publication/zha-2020-hyper-ap/

作者：Yue Zha, University of Pennsylvania, Computational Intelligence Lab

# 一、背景知识
## 1. AP: Associate Processing简介
### 1.1 冯诺依曼体系结构
![冯诺依曼架构](https://lh3.googleusercontent.com/7w1pQsfLux6UT--FUvGqkW0gq8wbmBbZRm8XXlD9rzXKwDEuKvjDLjCV-h8eijMzdvI=w2400 "冯诺依曼架构")
执行一个A数组与B数组的与操作，设计到将数据从memory load到SIMD solt，然后计算在ALU中执行，最后结果再写回Memroy中。