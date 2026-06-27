Title: Mail::MIMEDefang::Utils(3) - man page
Description: Mail::MIMEDefang::Utils are a set of methods that can be called from mimedefang-filter(5) or by other methods.
Author: gbechis
Slug: man_Mail::MIMEDefang::Utils
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Utils - Support methods used internally or by email filters

# DESCRIPTION

Mail::MIMEDefang::Utils are a set of methods that can be called
from `mimedefang-filter` or by other methods.

# METHODS

- time\_str

    Method that returns a string representing the current time.

- hour\_str

    Method that returns a string representing the current hour.

- synthesize\_received\_header

    Method that synthesizes a valid Received: header to reflect re-mailing.
    Needed by Apache SpamAssassin to correctly parse email messages.

- copy\_or\_link

    Method that copies a file if it fails to create an hard link
    to the original file.

- read\_results

    Method that extracts an array of command, key, values from RESULTS file,
    needed for regression tests.

- re\_match

    Method that returns 1 if either Content-Disposition.filename or
    Content-Type.name matches the regexp; 0 otherwise.

- re\_match\_ext

    Method that returns 1 if the EXTENSION part of either
    Content-Disposition.filename or Content-Type.name matches regexp; 0 otherwise.

- re\_match\_in\_rar\_directory

    Method that returns 1 if the EXTENSION part of any file in the rar archive
    matches regexp.
    To enable the check $Features{'unrar'} should be enabled.

- re\_match\_in\_7zip\_directory

    Method that returns 1 if the EXTENSION part of any file in the 7zip archive
    matches regexp.
    To enable the check $Features{'7zip'} should be enabled.

- re\_match\_in\_tgz\_directory

    Method that returns 1 if the EXTENSION part of any file in the tgz archive
    matches regexp.
    Files with extensione .tar.gz, .tar.bz2 and .tbz are also checked.
    To enable the check $Features{'tar'} should be enabled.

- re\_match\_in\_zip\_directory

    Method that returns 1 if the EXTENSION part of any file in the zip archive
    matches regexp.

- md\_copy\_orig\_msg\_to\_work\_dir\_as\_mbox\_file

    Method that copies original INPUTMSG file into work directory for virus-scanning
    as a valid mbox file.

- gen\_mx\_id

    Method that generates a random indentifier used by MIMEDefang
    to create temporary files.
