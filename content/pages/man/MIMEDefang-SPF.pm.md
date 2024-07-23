Title: MIMEDefang - documentation
Date: 2024-06-23 17:19:10
Author: gbechis
Slug: man_Mail::MIMEDefang::SPF
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::SPF - Sender Policy Framework interface for MIMEDefang

# DESCRIPTION

Mail::MIMEDefang::SPF is a module used to check for Sender Policy
Framework headers from mimedefang-filter.

# METHODS

md_spf_verify

:   Returns code and explanation of Sender Policy Framework
    check.
    Possible return code values are:
    "pass", "fail", "softfail", "neutral", "none", "error", "permerror", "temperror", "invalid"
    The method accepts the following parameters:

    $email

    :    The email address of the sender

    $relayip

    :    The relay ip address

    $helo (optional)

    :    The MTA helo server name
