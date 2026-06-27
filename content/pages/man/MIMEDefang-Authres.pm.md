Title: Mail::MIMEDefang::Authres(3) - man page
Description: Mail::MIMEDefang::Authres is a module used to add Authentication Results headers from mimedefang-filter(5)
Author: gbechis
Slug: man_Mail::MIMEDefang::Authres
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Authres - Authentication Results interface for MIMEDefang

# DESCRIPTION

Mail::MIMEDefang::Authres is a module used to add Authentication Results
headers from `mimedefang-filter`.

# METHODS

- md\_authres

    Returns a mail Authentication-Results header value.
    The method accepts the following parameters:

    - `$email`

        The email address of the sender

    - `$relayip`

        The relay ip address

    - `$serverdomain`

        The domain name of the server where MIMEDefang is running on

    - `$helo` (optional)

        The MTA helo server name

    - `$bimi_domain` (optional)

        The From: header domain to use for BIMI lookup.  When provided and when DMARC
        passes at enforcement level, a `bimi=pass` (or `bimi=fail`) result is
        appended to the Authentication-Results header.
