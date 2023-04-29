import os
from IPython.display import Javascript, display

def initialize_jupyter_runtime():
    js = '''IPython.notebook.kernel.execute('__jupyter__file__ = "' + IPython.notebook.notebook_name + '"')'''
    Javascript(js)


def export_to_blog(path):
    def getFileName(base_name, tail):
        return base_name + "." + tail

    base_name = os.path.basename(path)

    os.system('jupyter nbconvert --to html {0}'.format(path))
    html_file = getFileName(base_name, "html") 
    os.system('mv {} {}'.format(html_file, "./html/" + html_file))

    os.system('jupyter nbconvert --to markdown {0}'.format(path))
    md_file = getFileName(base_name, "md") 
    os.system('mv {} {}'.format(md_file, "./markdown/" + md_file))

    os.system('jupyter nbconvert --to pdf {0}'.format(path))
    pdf_file = getFileName(base_name, "pdf") 
    os.system('mv {} {}'.format(pdf_file, "./pdf/" + pdf_file))

    import toBlog
    toBlog.write_meta_info("./markdown/" + md_file)
    toBlog.post_this_md("./markdown/" + md_file)

