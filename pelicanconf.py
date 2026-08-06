# -*- coding: utf-8 -*- #

AUTHOR = 'MIMEDefang'
SITENAME = 'MIMEDefang'
SITEURL = 'https://mimedefang.org'
# Always absolute, regardless of RELATIVE_URLS -- for tags (canonical, og:*)
# that must never be relativized.
SITEURL_ABSOLUTE = 'https://mimedefang.org'
THEME = 'themes/mimedefang'

PATH = 'content'
PAGE_URL = '{slug}.html'
PAGE_SAVE_AS = '{slug}.html'

# Ship an .htaccess (compression + cache lifetimes) with the build.
STATIC_PATHS = ['extra/htaccess']
EXTRA_PATH_METADATA = {
    'extra/htaccess': {'path': '.htaccess'},
}
DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = False
MENUITEMS = [('Download', '/download/'), ('Mailing List', '/mailing-list/'), ('Documentation', '/documentation/'), ('FAQ', '/faq/'), ('Snippets', '/snippets/')]

TIMEZONE = 'UTC'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = False

# Plugins
# sitemap: https://pypi.org/project/pelican-sitemap/
# css_html_js_minify: minifies generated CSS/JS/HTML in the output directory
PLUGIN_PATHS = ["plugins"]
PLUGINS = ["sitemap", "minify_assets"]

SITEMAP = {
    "format": "xml",
    "priorities": {
        "articles": 0.5,
        "indexes": 0.5,
        "pages": 0.5
    },
    "changefreqs": {
        "articles": "weekly",
        "indexes": "weekly",
        "pages": "weekly"
    }
}

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True

# Disable unneeded blog features
ARCHIVES_SAVE_AS = ""
AUTHOR_SAVE_AS = ""
AUTHORS_SAVE_AS = ""
CATEGORY_SAVE_AS = ""
CATEGORIES_SAVE_AS = ""
TAGS_SAVE_AS = ""

import datetime

tdate = datetime.date.today()
YEAR = tdate.strftime("%Y")
DEFAULT_DATE = 'fs'

from pelican.settings import DEFAULT_CONFIG
from pelican.readers import MarkdownReader

config = DEFAULT_CONFIG.copy()
RELEASES, _ = MarkdownReader(config).read("content/pages/_releases.md")
DOWNLOAD, _ = MarkdownReader(config).read("content/pages/_download.md")
MAILINGLIST, _ = MarkdownReader(config).read("content/pages/_mailinglist.md")
THANKYOU, _ = MarkdownReader(config).read("content/pages/_thankyou.md")
MD_VER = "3.7.1"
MD_VER_DATE = "2026-07-14"
MD_SMTPD_VER = "0.2"
