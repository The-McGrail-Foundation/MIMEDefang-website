Title: Mail::MIMEDefang(3) - man page
Description: Mail::MIMEDefang(3) is a framework for filtering e-mail. It uses Sendmail's Milter API, some C glue code, and some Perl code to let you write high-performance mail filters in Perl.
Author: gbechis
Slug: man_Mail::MIMEDefang
Status: published
Template: documentation

# NAME

Mail::MIMEDefang - email filtering milter

# DESCRIPTION

Mail::MIMEDefang is a framework for filtering e-mail.
It uses Sendmail's "Milter" API, some C glue code, and some Perl code to let you write high-performance mail filters in Perl.

People use MIMEDefang to:

    Block viruses
    Block or tag spam
    Remove HTML mail parts
    Add boilerplate disclaimers to outgoing mail
    Remove or alter attachments
    Replace attachments with URL's
    Implement sophisticated access controls.

You're limited only by your imagination. If you can think of it and code it in Perl, you can do it with MIMEDefang.

# METHODS

- init\_globals

    Initialize global variables used across MIMEDefang instance
    and filter.

- print\_and\_flush(text)

    Prints to stdout and flush buffer.

- md\_openlog(tag, facility)

    Initialize e syslog object using Sys::Syslog or Unix::Syslog as
    appropriate.

- md\_syslog(facility, msg)

    Prints a message to syslog(3) using the specified facility

- md\_graphdefang\_log

    This is called to log events that occur during mimedefang processing.
    It should be called from mimedefang-filter with appropriate
    event names and values.

    Possible examples:

    `md_graphdefang_log('virus',$VirusName,$filename);`

    `md_graphdefang_log('spam',$hits);`

    `md_graphdefang_log('bad_filename',$filename,$extension);`

    If you need to log UTF-8 strings you can call the sub as:

    `md_graphdefang_log('spam',$hits, undef, 1);`

- md\_graphdefang\_log\_array

    This is called to log events that occur during mimedefang processing.
    It should be called from mimedefang-filter with appropriate
    event names and values.

    Possible examples:

    `md_graphdefang_log_array('virus',0,\@info);`

    If you need to log UTF-8 strings you can call the sub as:

    `md_graphdefang_log_array('spam',1,\@info);`

- detect\_and\_load\_perl\_modules

    Automatically detect and load Perl modules needed for some features
    like SpamAssassin, rbl checks, zip file listing and HTML parsing.

- detect\_antivirus\_support

    Check if antivirus support should be loaded by looking at %Features

- init\_status\_tag

    Open the status file descriptor

- set\_status\_tag(depth, tag)

    Sets the status tag for this worker inside the multiplexor.

- push\_status\_tag(tag)

    Updates status tag inside multiplexor and pushes onto stack.

- pop\_status\_tag

    Pops previous status of stack and sets tag in multiplexor.

- percent\_encode(str)

    Encode a string with unsafe chars as "%XY" where X and Y are hex digits.

- percent\_encode\_for\_graphdefang(str)

    Encode a string with unsafe chars as "%XY" where X and Y are hex digits.

    Quotes or spaces are not encoded but commas are encoded.

- percent\_decode(str)

    Decode a string previously encoded by percent\_encode().

- write\_result\_line ( $cmd, @args )

    Writes a result line to the RESULTS file.

    $cmd should be a one-letter command for the RESULTS file

    @args are the arguments for $cmd, if any.  They will be percent\_encode()'ed
    before being written to the file.

    Returns 0 or 1 and an optional warning message.

- signal\_unchanged

    Tells mimedefang C program message has not been altered.

- signal\_changed

    Tells mimedefang C program message has been altered.

- in\_message\_context(name)

    Returns 1 if we are processing a message; 0 otherwise.

- in\_filter\_wrapup(name)

    Returns 1 if we are not in filter wrapup; 0 otherwise.

- in\_filter\_context

    Returns 1 if we are inside filter or filter\_multipart, 0 otherwise.

- in\_filter\_end(name)

    Returns 1 if we are inside filter\_end 0 otherwise.

- send\_quarantine\_notifications

    Sends quarantine notification message, if anything was quarantined.

- signal\_complete

    Tells mimedefang C program Perl filter has finished successfully.

    Also mails any quarantine notifications and sender notifications.

- send\_mail(fromAddr, fromFull, recipient, body, deliverymode)

    Sends a mail message using Sendmail.

    Invokes Sendmail without involving the shell, so that shell metacharacters won't cause security problems.

    Delivery mode parameter is the optional sendmail delivery mode arg (default "-odd").

- send\_multipart\_mail(fromAddr, fromName, recipient, subject, body\_text, body\_html, extra\_headers)

    Sends a multipart mail message using Sendmail.

    Invokes Sendmail without involving the shell, so that shell metacharacters won't cause security problems.

- send\_admin\_mail(subject, body)

    Sends a mail message to the administrator

- read\_commands\_file()

    This function should only be called from `filter_sender` and
    `filter_recipient`. This will read the `COMMANDS` file (as
    described in [mimedefang-protocol(7)](http://man.he.net/man7/mimedefang-protocol)), and will fill or update the
    following global variables: $Sender, @Recipients, %RecipientMailers,
    $RelayAddr, $RealRelayAddr, $RelayHostname, $RealRelayHostname,
    $QueueID, $Helo, %SendmailMacros.

    If you do not call `read_commands_file`, then the only information
    available in `filter_sender` and `filter_recipient` is that
    which is passed as an argument to the function.

## SEE ALSO

[Mail::MIMEDefang::Actions(3)](http://man.he.net/man3/Mail::MIMEDefang::Actions)

[Mail::MIMEDefang::Antispam(3)](http://man.he.net/man3/Mail::MIMEDefang::Antispam)

[Mail::MIMEDefang::Antivirus(3)](http://man.he.net/man3/Mail::MIMEDefang::Antivirus)

[Mail::MIMEDefang::DKIM(3)](http://man.he.net/man3/Mail::MIMEDefang::DKIM)

[Mail::MIMEDefang::DKIM::ARC(3)](http://man.he.net/man3/Mail::MIMEDefang::DKIM::ARC)

[Mail::MIMEDefang::Authres(3)](http://man.he.net/man3/Mail::MIMEDefang::Authres)

[Mail::MIMEDefang::Mail(3)](http://man.he.net/man3/Mail::MIMEDefang::Mail)

[Mail::MIMEDefang::MIME(3)](http://man.he.net/man3/Mail::MIMEDefang::MIME)

[Mail::MIMEDefang::Net(3)](http://man.he.net/man3/Mail::MIMEDefang::Net)

[Mail::MIMEDefang::RFC2822(3)](http://man.he.net/man3/Mail::MIMEDefang::RFC2822)

[Mail::MIMEDefang::Unit(3)](http://man.he.net/man3/Mail::MIMEDefang::Unit)

[Mail::MIMEDefang::Utils(3)](http://man.he.net/man3/Mail::MIMEDefang::Utils)
