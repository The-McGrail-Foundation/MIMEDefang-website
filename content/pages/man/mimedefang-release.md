Title: mimedefang-release(8) - man page
Description: mimedefang-release(8) is a tool that permits to release quarantined messages or to attach the messages to a new email message.
Author: gbechis
Slug: man_mimedefang-release
Status: published
Template: documentation


# NAME

mimedefang-release - a tool to release quarantined email messages

# DESCRIPTION

**mimedefang-release**(8) is a tool that permits to release quarantined
messages or to attach the messages to a new email message.

# SYNOPSIS

mimedefang-release [options] <directory\> ...  

# OPTIONS

-a enable attach mode, the released email will be sent as an attachment to the
user.  
-h display the help  
-d path to the quarantined directory, it can
be an absolute path or relative to MIMEDefang quarantine spool
directory.  
-s set a custom subject for the email, this option is valid
only in attach mode.  
-S specify an smtp server, in this mode the
quarantined email will be delivered to the original user without
modifications.  
-t enable TLS when delivering the email in smtp mode.  
-z compress the quarantined email using Archive::Zip. this option is valid
only in attach mode.

# EXAMPLES

mbox mode: mimedefang-release -s "Message Released" -a -z -d
2023-04-16-14/qdir-2023-04-16-14.36.05-001

smtp mode: mimedefang-release -S 192.168.0.254 -d
2023-04-16-14/qdir-2023-04-16-14.36.05-001

# AUTHOR

**mimedefang-release** (8) was written by Giovanni Bechis
<giovanni at paclan.it\>. The mimedefang home page is
<https://www.mimedefang.org/>.

# SEE ALSO

**mimedefang.pl** (8), **mimedefang-filter** (5), **mimedefang** (8),
**mimedefang-protocol** (7), **watch-mimedefang** (8)
