import glob

from css_html_js_minify import process_single_css_file
from pelican import signals


def minify_output(pelican):
    # Only CSS is minified here. css-html-js-minify's regex-based JS
    # minifier corrupts modern ES6+ syntax (e.g. bootstrap.bundle.min.js),
    # and its HTML minifier collapses inline <script> blocks onto a single
    # line, breaking ASI-reliant statements in faq.html/snippets.html.
    for f in glob.iglob(pelican.output_path + '/**/*.css', recursive=True):
        process_single_css_file(f, overwrite=True)


def register():
    signals.finalized.connect(minify_output)
