Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_Mail::MIMEDefang::RFC2822
Status: published
Template: documentation

# NAME
    Mail::MIMEDefang::RFC2822 - Dates related methods for email filters

# DESCRIPTION
    Mail::MIMEDefang::RFC2822 are a set of methods that can be called from
    mimedefang-filter to create RFC2822 formatted dates.

# METHODS
    gen_date_msgid_headers
        Method that generates RFC2822 compliant Date and Message-ID headers.

    rfc2822_date
        Method that returns an RFC2822 formatted date.

    header_timezone
        Method that returns an RFC2822 compliant timezone header.

    gen_msgid_header
        Method that generates RFC2822 compliant Message-ID headers.
