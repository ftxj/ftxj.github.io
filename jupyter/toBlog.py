import os
import argparse
from datetime import datetime

parser = argparse.ArgumentParser(description="toBlog")

parser.add_argument('--path', required=True, type=str)
args = parser.parse_args()

def get_file_name(path):
    filename = str(os.path.split(path)[1])
    x = os.path.splitext(filename)[0]
    return x

def time_string():
    time_now = datetime.now()
    s = time_now.strftime("%Y-%m-%d %H:%M:%S")
    return s

def header():
    head = '''
<!-- toBlog..runed -->
---
layout:
  - post
title: {0}
date: {1}
tags: {2}
---
'''.format(get_file_name(args.path), time_string(), "jupyter")
    print(head)
    return head

def write_meta_info():
    with open(args.path, "r+") as f:
        old = f.read()
        lines = old.splitlines()
        if "<!-- toBlog..runed -->" == lines[0]:
            return
        f.seek(0)
        f.write(header())
        f.write(old)

def post_this_md():
    original_path = args.path
    new_path = "../_posts/" + get_file_name(args.path) + ".md"
    os.system("cp {0} {1}".format(original_path, new_path))
    os.system("cd ..; git add .; git commit -m 'add {0}'; git push".format(get_file_name))

write_meta_info()
post_this_md()
