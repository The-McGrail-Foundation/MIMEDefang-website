Title: mimedefang.pl(8) - man page
Description: mimedefang.pl(8) is a Perl script designed to work with mimedefang(8).
Author: gbechis
Slug: man_mimedefang_pl
Status: published
Template: documentation

# MIMEDEFANG.PL

[NAME](#NAME)  
[SYNOPSIS](#SYNOPSIS)  
[DESCRIPTION](#DESCRIPTION)  
[OPTIONS](#OPTIONS)  
[OPERATION](#OPERATION)  
[TESTING FILTERS](#TESTING%20FILTERS)  
[MISCELLANEOUS OPTIONS](#MISCELLANEOUS%20OPTIONS)  
[AUTHOR](#AUTHOR)  
[SEE ALSO](#SEE%20ALSO)  

------------------------------------------------------------------------

## NAME <span id="NAME"></span>

mimedefang.pl − Perl script to scan MIME messages.

## SYNOPSIS <span id="SYNOPSIS"></span>

**mimedefang.pl \[-f** *filter*\] *dir*

## DESCRIPTION <span id="DESCRIPTION"></span>

***mimedefang.pl*** is a Perl script designed to work with
**mimedefang**(8). It takes a single argument which is a directory which
should contain files laid out as described in **mimedefang**(8).

## OPTIONS <span id="OPTIONS"></span>

**−f** *filter*

Specifies the name of the file containing the filter. If this option is
omitted, the default filter **@CONFDIR_EVAL@/mimedefang-filter** is
used.

## OPERATION <span id="OPERATION"></span>

**mimedefang.pl** evaluates the file
**@CONFDIR_EVAL@/mimedefang-filter** as a Perl fragment. This file
should define the **filter** procedure. For each part of a MIME message,
**mimedefang.pl** calls **filter** and disposes of the part as
instructed by the filter. The various modes of disposition are described
in **mimedefang-filter**(5).

## TESTING FILTERS <span id="TESTING FILTERS"></span>

You are *strongly* recommended to test your filter before installing it
in **@CONFDIR_EVAL@/mimedefang-filter**. To test the filter, save it in
a file (e.g. **test-filter**) and run this command:

|     |     |                                    |
|-----|-----|------------------------------------|
|     |     | mimedefang.pl -f test-filter -test |

This tests the filter for syntactic correctness. If it passes, you can
install it as a production filter. (Note that the test tests only for
correct Perl syntax; it doesn’t make sure your filter does something
sensible.)

## MISCELLANEOUS OPTIONS <span id="MISCELLANEOUS OPTIONS"></span>

There are a few other ways to invoke mimedefang.pl:

|     |                         |
|-----|-------------------------|
|     | mimedefang.pl -features |

prints a list of detected optional Perl modules. The output looks
something like this:

|     |                         |
|-----|-------------------------|
|     | SpamAssassin: yes       |
|     | mimedefang.pl -validate |

calls the function filter_validate, if it is defined in your filter.
filter_validate should return an integer; this becomes the exit code. If
filter_validate does not exist, an error message is printed and
**mimedefang.pl** exits with an exit code of 1.

## AUTHOR <span id="AUTHOR"></span>

**mimedefang.pl** was written by Dianne Skoll
\<dfs@roaringpenguin.com\>. The **mimedefang** home page is
*https://www.mimedefang.org/*.

## SEE ALSO <span id="SEE ALSO"></span>

mimedefang(8), mimedefang-filter(5), mimedefang-protocol(7),
mimedefang-release(8)

------------------------------------------------------------------------
