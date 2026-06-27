Title: Mail::MIMEDefang::Mail(3) - man page
Description: Mail::MIMEDefang::Mail are a set of methods that can be called from mimedefang-filter(5) to send email messages or to run SMTP checks.
Author: gbechis
Slug: man_Mail::MIMEDefang::Mail
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Mail - Mail and SMTP related methods for email filters

# DESCRIPTION

Mail::MIMEDefang::Mail are a set of methods that can be called
from `mimedefang-filter` to send email messages or to run SMTP checks.

# METHODS

- resend\_message\_one\_recipient

    Method that re-sends the message as if it came from original sender to
    a single recipient.

- resend\_message\_specifying\_mode

    Method that re-sends the message as if it came from original sender to
    a list of recipients.

- resend\_message

    Method that re-sends the message as if it came from original sender to
    a list of recipients.

- pretty\_print\_mail

    Method that makes a pretty-printed version of the e-mail body no longer
    than size characters.

- get\_smtp\_return\_code

    Method that reads return codes from SMTP server, returns a four-element
    list:(retval, code, dsn, text), where code is a 3-digit SMTP code.
    Retval is 'CONTINUE', 'TEMPFAIL' or 'REJECT'.

- get\_smtp\_extensions

    Method that checks SMTP server's supported extensions.
    It expects EHLO to have been sent already (artifact of get\_smtp\_return\_code).
    The sub returns a four-element list:(retval, code, dsn, exts)

    - retval is 'CONTINUE', 'TEMPFAIL', or 'REJECT'.
    - code is a 3-digit SMTP code.
    - dsn is an extended SMTP status code
    - exts is a hash of EXTNAME->EXTOPTS

- md\_check\_against\_smtp\_server

    Method that verifies a recipient against another SMTP server by issuing a
    HELO / MAIL FROM: / RCPT TO: / QUIT sequence.

    The method accepts the following parameters:

    - sender e-mail address
    - recipient e-mail address
    - helo string to put in "HELO" command
    - SMTP server to try.
    - optional: Port to connect on (defaults to 25)

    The method returns:

    - ('CONTINUE', "OK") if recipient is OK
    - ('TEMPFAIL', "err") if temporary failure
    - ('REJECT', "err") if recipient is not OK.
