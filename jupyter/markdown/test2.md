<!-- toBlog..runed -->
---
layout:
  - post
title: test2
date: 2023-04-29 06:40:11
tags: jupyter
---

```python
import torch

```


```python
print("hello")
```

    hello



```python
import os
os.run('jupyter nbconvert --to html Test.ipynb')
os.run('jupyter nbconvert --to markdown Test.ipynb')

```


    ---------------------------------------------------------------------------

    AttributeError                            Traceback (most recent call last)

    Cell In[3], line 2
          1 import os
    ----> 2 os.run('jupyter nbconvert --to html Test.ipynb')
          3 os.run('jupyter nbconvert --to markdown Test.ipynb')


    AttributeError: module 'os' has no attribute 'run'



```python

```
