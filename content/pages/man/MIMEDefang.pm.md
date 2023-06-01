Title: MIMEDefang - documentation
Date: 2022-08-24 00:00:23
Author: gbechis
Slug: man_Mail::MIMEDefang
Status: published
Template: documentation

# NAME

Mail::MIMEDefang - email filtering milter

# DESCRIPTION

Mail::MIMEDefang is a framework for filtering e-mail. It uses
Sendmail\'s Milter API, some C glue code, and some Perl code to let you
write high-performance mail filters in Perl.

People use MIMEDefang to:

Block viruses Block or tag spam Remove HTML mail parts Add boilerplate
disclaimers to outgoing mail Remove or alter attachments Replace
attachments with URLs Implement sophisticated access controls.

You\'re limited only by your imagination. If you can think of it and
code it in Perl, you can do it with MIMEDefang.

# METHODS

init_globals

:   Initialize global variables used across MIMEDefang instance and
    filter.

print_and_flush(text)

:   Prints to stdout and flush buffer.

md_openlog(tag, facility)

:   Initialize e syslog object using Sys::Syslog or Unix::Syslog as
    appropriate.

md_syslog(facility, msg)

:   Prints a message to **syslog** (3) using the specified facility

md_graphdefang_log

:   This is called to log events that occur during mimedefang
    processing. It should be called from mimedefang-filter with
    appropriate event names and values.
    Possible examples:
    `md_graphdefang_log(virus,$VirusName,$filename);`
    `md_graphdefang_log(spam,$hits);`
    `md_graphdefang_log(bad_filename,$filename,$extension);`
    If you need to log UTF-8 strings you can call the sub as:
    `md_graphdefang_log('spam',$hits, undef, 1)`

detect_and_load_perl_modules

:   Automatically detect and load Perl modules needed for some features
    like SpamAssassin, rbl checks, zip file listing and HTML parsing.

detect_antivirus_support

:   Check if antivirus support should be loaded by looking at
    `%Features`

init_status_tag

:   Open the status file descriptor

set_status_tag(depth, tag)

:   Sets the status tag for this worker inside the multiplexor.

push_status_tag(tag)

:   Updates status tag inside multiplexor and pushes onto stack.

pop_status_tag

:   Pops previous status of stack and sets tag in multiplexor.

percent_encode(str)

:   Encode a string with unsafe chars as %XY where X and Y are hex
    digits.

percent_encode_for_graphdefang(str)

:   Encode a string with unsafe chars as %XY where X and Y are hex
    digits. Quotes or spaces are not encoded but commas are encoded.

percent_decode(str)

:   Decode a string previously encoded by **percent_encode()**.

write_result_line ( \$cmd, \@args )

:   Writes a result line to the RESULTS file. `$cmd` should be a
    one-letter command for the RESULTS file `@args` are the arguments
    for `$cmd`, if any. They will be **percent_encode()**\'ed before
    being written to the file. Returns 0 or 1 and an optional warning
    message.

signal_unchanged

:   Tells mimedefang C program message has not been altered.

signal_changed

:   Tells mimedefang C program message has been altered.

in_message_context(name)

:   Returns 1 if we are processing a message; 0 otherwise.

in_filter_wrapup(name)

:   Returns 1 if we are not in filter wrapup; 0 otherwise.

in_filter_context

:   Returns 1 if we are inside filter or filter_multipart, 0 otherwise.

in_filter_end(name)

:   Returns 1 if we are inside filter_end 0 otherwise.

send_quarantine_notifications

:   Sends quarantine notification message, if anything was quarantined.

signal_complete

:   Tells mimedefang C program Perl filter has finished successfully.
    Also mails any quarantine notifications and sender notifications.

send_mail(fromAddr, fromFull, recipient, body, deliverymode)

:   Sends a mail message using Sendmail. Invokes Sendmail without
    involving the shell, so that shell metacharacters won\'t cause
    security problems. Deliverimode parameter is the optional sendmail
    delivery mode arg (default -odd).

send_admin_mail(subject, body)

:   Sends a mail message to the administrator

## SEE ALSO

**Mail::MIMEDefang::Actions** (3)

**Mail::MIMEDefang::Antispam** (3)

**Mail::MIMEDefang::Antivirus** (3)

**Mail::MIMEDefang::DKIM** (3)

**Mail::MIMEDefang::DKIM::ARC** (3)

**Mail::MIMEDefang::Authres** (3)

**Mail::MIMEDefang::Mail** (3)

**Mail::MIMEDefang::MIME** (3)

**Mail::MIMEDefang::Net** (3)

**Mail::MIMEDefang::RFC2822** (3)

**Mail::MIMEDefang::Unit** (3)

**Mail::MIMEDefang::Utils** (3)
