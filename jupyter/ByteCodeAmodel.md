Python ByteCode的行为模型解释


```python
def fn():
    a = 3
    b = 4
    return a + b
```


```python
import dis
code = dis.dis(fn)
```

      2           0 LOAD_CONST               1 (3)
                  2 STORE_FAST               0 (a)
    
      3           4 LOAD_CONST               2 (4)
                  6 STORE_FAST               1 (b)
    
      4           8 LOAD_FAST                0 (a)
                 10 LOAD_FAST                1 (b)
                 12 BINARY_ADD
                 14 RETURN_VALUE



```python
import jupyter_runtime
```


```python
import os
from IPython.display import Javascript, display

def initialize_jupyter_runtime():
    js = '''IPython.notebook.kernel.execute('jupyter__file2 = "' + IPython.notebook.notebook_name + '"')'''
    x = Javascript(js)
    

x =initialize_jupyter_runtime()
```


```python
import os
full_name = os.path.join(os.getcwd(), jupyter__file2)
```


    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    Cell In[21], line 2
          1 import os
    ----> 2 full_name = os.path.join(os.getcwd(), jupyter__file2)


    NameError: name 'jupyter__file2' is not defined



```python

```
