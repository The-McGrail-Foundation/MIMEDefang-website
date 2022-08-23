Title: MIMEDefang - documentation
Date: 2022-08-24 00:00:24
Author: gbechis
Slug: man_Mail::MIMEDefang::Mail
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Mail - Mail and SMTP related methods for email filters

# DESCRIPTION

Mail::MIMEDefang::Mail are a set of methods that can be called from
*mimedefang-filter* to send email messages or to run SMTP checks.

# METHODS

resend_message_one_recipient

:   Method that re-sends the message as if it came from original sender
    to a single recipient.

resend_message_specifying_mode

:   Method that re-sends the message as if it came from original sender
    to a list of recipients.

resend_message

:   Method that re-sends the message as if it came from original sender
    to a list of recipients.

pretty_print_mail

:   Method that makes a pretty-printed version of the e-mail body no
    longer than size characters.

get_smtp_return_code

:   Method that reads return codes from SMTP server, returns a
    four-element list:(retval, code, dsn, text), where code is a 3-digit
    SMTP code. Retval is \'CONTINUE\', \'TEMPFAIL\' or \'REJECT\'.

get_smtp_extensions

:   Method that checks SMTP server\'s supported extensions. It expects
    EHLO to have been sent already (artifact of get_smtp_return_code).
    The sub returns a four-element list:(retval, code, dsn, exts)

    -   retval is \'CONTINUE\', \'TEMPFAIL\', or \'REJECT\'.

    -   code is a 3-digit SMTP code.

    -   dsn is an extended SMTP status code

    -   exts is a hash of EXTNAME-\>EXTOPTS

md_check_against_smtp_server

:   Method that verifies a recipient against another SMTP server by
    issuing a HELO / MAIL FROM: / RCPT TO: / QUIT sequence. The method
    returns:

    -   (\'CONTINUE\', OK) if recipient is OK

    -   (\'TEMPFAIL\', err) if temporary failure

    -   (\'REJECT\', err) if recipient is not OK.
