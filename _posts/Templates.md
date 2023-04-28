---
layout:
  - post
title: C++ Templates Basic
date: 2022-11-18 11:24:47
tags:
---

知识点：函数模板，类模板，变长模板，非类型模板，成员函数模板，变量模板，template template，typename
sizeof..., flod expressions,

# Motivation：为什么需要 template？
针对不同类型，实现同样的功能，可以用template实现。
其他方法：针对 Object* 来实现template？不行，type checking

实现：common_type<>, decay<>, decltype


