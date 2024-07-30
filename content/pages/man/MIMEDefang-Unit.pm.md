Title: Mail::MIMEDefang::Unit(3) - man page
Description: Mail::MIMEDefang::Unit are a set of methods that are called from MIMEDefang regression tests.
Author: gbechis
Slug: man_Mail::MIMEDefang::Unit
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Unit - Methods used by MIMEDefang regression tests

# DESCRIPTION

Mail::MIMEDefang::Unit are a set of methods that are called from
MIMEDefang regression tests.

# METHODS

include_mimedefang

:   Method that includes *mimedefang.pl.in* code without running
    anything.

smtp_mail

:   Method which sends a test email and returns SMTP replies.
