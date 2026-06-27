Title: Mail::MIMEDefang::RFC2822(3) - man page
Description: Mail::MIMEDefang::RFC2822 are a set of methods that can be called from mimedefang-filter(5) to create RFC2822 formatted dates.
Author: gbechis
Slug: man_Mail::MIMEDefang::RFC2822
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::RFC2822 - Dates related methods for email filters

# DESCRIPTION

Mail::MIMEDefang::RFC2822 are a set of methods that can be called
from `mimedefang-filter` to create RFC2822 formatted dates.

# METHODS

- gen\_date\_msgid\_headers

    Method that generates RFC2822 compliant Date and Message-ID headers.

- rfc2822\_date

    Method that returns an RFC2822 formatted date.

- header\_timezone

    Method that returns an RFC2822 compliant timezone header.

- gen\_msgid\_header

    Method that generates RFC2822 compliant Message-ID headers.
