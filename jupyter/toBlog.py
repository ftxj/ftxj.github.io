import os
import argparse
from datetime import datetime

# parser = argparse.ArgumentParser(description="toBlog")

# parser.add_argument('--path', required=True, type=str)
# args = parser.parse_args()


def get_file_name(path):
    filename = str(os.path.split(path)[1])
    x = os.path.splitext(filename)[0]
    return x


def time_string():
    time_now = datetime.now()
    s = time_now.strftime("%Y-%m-%d %H:%M:%S")
    return s


def header(path):
    head = '''
---
layout:
  - post
title: {0}
date: {1}
tags: {2}
---
'''.format(get_file_name(path), time_string(), "jupyter")
    print(head)
    return head


def write_meta_info(path):
    if(not os.path.exists(path)):
        return
    with open(path, "r+") as f:
        old = f.read()
        lines = old.splitlines()
        if "---" == lines[0]:
            return
        f.seek(0)
        f.write(header())
        f.write(old)


def post_this_md(path):
    original_path = path
    if(not os.path.exists(path)):
        os.system(
            "cd ..; git add .; git commit -m 'add {0}'; git push; cd ..;".format("update script"))
        return
    new_path = "../_posts/" + get_file_name(path) + ".md"
    if(not os.path.exists(new_path)):
        os.system("cp {0} {1}".format(original_path, new_path))
        os.system(
            "cd ..; git add .; git commit -m 'add {0}'; git push; cd ..;".format(get_file_name()))
        return



