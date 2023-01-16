Title: MIMEDefang - documentation
Date: 2022-08-24 00:00:24
Author: gbechis
Slug: man_Mail::MIMEDefang::Utils
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Utils - Support methods used internally or by email
filters

# DESCRIPTION

Mail::MIMEDefang::Utils are a set of methods that can be called from
*mimedefang-filter* or by other methods.

# METHODS

time_str

:   Method that returns a string representing the current time.

hour_str

:   Method that returns a string representing the current hour.

synthesize_received_header

:   Method that synthesizes a valid Received: header to reflect
    re-mailing. Needed by Apache SpamAssassin to correctly parse email
    messages.

copy_or_link

:   Method that copies a file if it fails to create an hard link to the
    original file.

read_results

:   Method that extracts an array of command, key, values from RESULTS
    file, needed for regression tests.

re_match

:   Method that returns 1 if either Content-Disposition.filename or
    Content-Type.name matches the regexp; 0 otherwise.

re_match_ext

:   Method that returns 1 if the EXTENSION part of either
    Content-Disposition.filename or Content-Type.name matches regexp; 0
    otherwise.

re_match_in_rar_directory

:   Method that returns 1 if the EXTENSION part of any file in the rar
    archive matches regexp.

re_match_in_7zip_directory

:   Method that returns 1 if the EXTENSION part of any file in the 7zip
    archive matches regexp.

re_match_in_zip_directory

:   Method that returns 1 if the EXTENSION part of any file in the zip
    archive matches regexp.

md_copy_orig_msg_to_work_dir_as_mbox_file

:   Method that copies original INPUTMSG file into work directory for
    virus-scanning as a valid mbox file.

gen_mx_id

:   Method that generates a random indentifier used by MIMEDefang
    to create temporary files.
