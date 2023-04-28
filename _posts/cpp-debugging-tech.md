---
layout:
  - post
title: CPP 中的调试技术
date: 2022-11-14 19:17:43
tags: C++
---

参考内容：Back to Basics: Debugging in C++ - Mike Shah - CppCon 2022

debugging 一直是我自己不擅长的地方，但由于debugging并不会导致你这个事情完全无法推进，因此学习如何高效的debugging一直被我搁置。今天刚好看到了CppCon上的debugging培训，特来学习。

# debug 策略

bug 的分类，logic bug，correctness bug，performance bug。

## dealt debugging

二分法printf找bug。

## macro with printf

定义 DEBUG 环境变量

# gdb

# vscode with gdb

# Q&A

1. Unit Test 覆盖率足够高的话，能否让所有的bug消失？