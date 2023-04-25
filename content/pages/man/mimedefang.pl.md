Title: MIMEDefang - documentation
Date: 2023-04-25 23:25:40
Author: gbechis
Slug: man_mimedefang.pl
Status: published
Template: documentation

# NAME

mimedefang.pl - Perl script to scan MIME messages.

# SYNOPSIS

**mimedefang.pl \[-f *filter*\] *dir***

# DESCRIPTION

**mimedefang.pl** is a Perl script designed to work with
**mimedefang**(8). It takes a single argument which is a directory which
should contain files laid out as described in **mimedefang**(8).

# OPTIONS

**-f *filter***

:   Specifies the name of the file containing the filter. If this option
    is omitted, the default filter **/etc/mail/mimedefang-filter** is
    used.

# OPERATION

**mimedefang.pl** evaluates the file **/etc/mail/mimedefang-filter** as
a Perl fragment. This file should define the **filter** procedure. For
each part of a MIME message, **mimedefang.pl** calls **filter** and
disposes of the part as instructed by the filter. The various modes of
disposition are described in **mimedefang-filter**(5).

# TESTING FILTERS

You are *strongly* recommended to test your filter before installing it
in **/etc/mail/mimedefang-filter**. To test the filter, save it in a
file (e.g. **test-filter**) and run this command:

    	mimedefang.pl -f test-filter -test

This tests the filter for syntactic correctness. If it passes, you can
install it as a production filter. (Note that the test tests only for
correct Perl syntax; it doesn\'t make sure your filter does something
sensible.)

# MISCELLANEOUS OPTIONS

There are a few other ways to invoke mimedefang.pl:

    	mimedefang.pl -features

prints a list of detected optional Perl modules. The output looks
something like this:

    	SpamAssassin: yes

    	mimedefang.pl -validate

calls the function filter_validate, if it is defined in your filter.
filter_validate should return an integer; this becomes the exit code. If
filter_validate does not exist, an error message is printed and
**mimedefang.pl** exits with an exit code of 1.

# AUTHOR

**mimedefang.pl** was written by Dianne Skoll
\<dfs@roaringpenguin.com\>. The **mimedefang** home page is
*https://www.mimedefang.org/*.

# SEE ALSO

mimedefang(8), mimedefang-filter(5), mimedefang-protocol(7),
mimedefang-release(8)
