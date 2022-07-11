Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_mimedefang-filter
Status: published
Template: documentation


# NAME

mimedefang-filter - Configuration file for MIMEDefang mail filter.

# DESCRIPTION

**mimedefang-filter** is a Perl fragment that controls how
**mimedefang.pl** disposes of various parts of a MIME message. In
addition, it contains some global variable settings that affect the
operation of **mimedefang.pl**.

# CALLING SEQUENCE

Incoming messages are scanned as follows:

1\) A temporary working directory is created. It is made the current
working directory and the e-mail message is split into parts in this
directory. Each part is represented internally as an instance of
MIME::Entity.

2\) If the file **/etc/mail/mimedefang-filter.pl** defines a Perl
function called **filter_begin**, it is called with a single argument
consisting of a MIME::Entity representing the parsed e-mail message. Any
return value is ignored.

3\) For each *leaf* part of the mail message, **filter** is called with
four arguments: **entity**, a MIME::Entity object; **fname**, the
suggested filename taken from the MIME Content-Disposition header;
**ext**, the file extension, and **type**, the MIME Content-Type value.
For each *non-leaf* part of the mail message, **filter_multipart** is
called with the same four arguments as **filter**. A non-leaf part of a
message is a part that contains nested parts. Such a part has no useful
body, but you should *still perform filename checks* to check for
viruses that use malformed MIME to masquerade as non-leaf parts (like
message/rfc822). In general, any action you perform in
**filter_multipart** applies to the part itself *and* any contained
parts.

Note that both **filter** and **filter_multipart** are optional. If you
do not define them, a default function that simply accepts each part is
used.

4\) After all parts have been processed, the function **filter_end** is
called if it has been defined. It is passed a single argument consisting
of the (possibly modified) MIME::Entity object representing the message
about to be delivered. Within **filter_end**, you can call functions
that modify the message headers body.

5\) After **filter_end** returns, the function **filter_wrapup** is
called if it has been defined. It is passed a single argument consisting
of the (possibly modified) MIME::Entity object representing the message
about to be delivered, including any modifications made in
**filter_end**. Within **filter_wrapup**, you can *not* call functions
that modify the message body, but you can still add or modify message
headers.

# DISPOSITION

**mimedefang.pl** examines each part of the MIME message and chooses a
*disposition* for that part. (A disposition is selected by calling one
of the following functions from **filter** and then immediately
returning.) Available dispositions are:

**action_accept**

:   The part is passed through unchanged. If no disposition function is
    returned, this is the default.

**action_accept_with_warning**

:   The part is passed through unchanged, but a warning is added to the
    mail message.

**action_drop**

:   The part is deleted without any notification to the recipients.

**action_drop_with_warning**

:   The part is deleted and a warning is added to the mail message.

**action_replace_with_warning**

:   The part is deleted and instead replaced with a text message.

**action_quarantine**

:   The part is deleted and a warning is added to the mail message. In
    addition, a copy of the part is saved on the mail server in the
    directory /var/spool/MD-Quarantine and a notification is sent to the
    MIMEDefang administrator.

**action_bounce**

:   The entire e-mail message is rejected and an error returned to the
    sender. The intended recipients are not notified. Note that in spite
    of the name, MIMEDefang does *not* generate and e-mail a failure
    notification. Rather, it causes the SMTP server to return a 5*XX*
    SMTP failure code.

**action_discard**

:   The entire e-mail message is discarded silently. Neither the sender
    nor the intended recipients are notified.

# CONTROLLING RELAYING

You can define a function called **filter_relay** in your filter. This
lets you reject SMTP connection attempts early on in the SMTP dialog,
rather than waiting until the whole message has been sent. Note that for
this check to take place, you must use the -r flag with **mimedefang**.

**filter_relay** is passed six arguments: \$hostip is the IP address of
the relay host (for example, \"127.0.0.1\"), \$hostname is the host name
if known (for example, \"localhost.localdomain\"). If the host name
could not be determined, \$hostname is \$hostip enclosed in square
brackets. (That is, (\"\$hostname\" eq \"\[\$hostip\]\") will be true.)

The remaining four arguments to **filter_relay** are \$port, \$myip,
\$myport and \$qid, which contain the client\'s TCP port, the Sendmail
daemon\'s listening IP address, the Sendmail daemon\'s listening port,
and the Sendmail Queue-ID, respectively. *Note* that the Queue-ID may
not yet be available at this stage (for example, Postfix does not
allocate a queue-ID this early.) If the Queue-ID is not available, the
string NOQUEUE is passed instead.

**filter_relay** must return a two-element list: (\$code, \$msg). \$msg
specifies the text message to use for the SMTP reply, but because of
limitations in the Milter API, this message is for documentation
purposes only\-\--you cannot set the text of the SMTP message returned
to the SMTP client from **filter_relay**.

\$code is a literal string, and can have one of the following values:

**\'REJECT\'**

:   if the connection should be rejected.

**\'CONTINUE\'**

:   if the connection should be accepted.

**\'TEMPFAIL\'**

:   if a temporary failure code should be returned.

**\'DISCARD\'**

:   if the message should be accepted and silently discarded.

**\'ACCEPT_AND_NO_MORE_FILTERING\'**

:   if the connection should be accepted *and no further filtering
    done*.

Earlier versions of MIMEDefang used -1 for TEMPFAIL, 0 for REJECT and 1
for CONTINUE. These values still work, but are deprecated.

In the case of REJECT or TEMPFAIL, \$msg specifies the text part of the
SMTP reply. \$msg *must not* contain newlines.

For example, if you wish to reject connection attempts from any machine
in the spammer.com domain, you could use this function:

    sub filter_relay {
    	my ($ip, $name) = @_;
    	if ($name =~ /spammer\.com$/) {
    		return ('REJECT', "Sorry; spammer.com is blacklisted");
    	}
    	return ('CONTINUE', "ok");
    }

# FILTERING BY HELO

You can define a function called **filter_helo** in your filter. This
lets you reject connections after the HELO/EHLO SMTP command. Note that
for this function to be called, you must use the -H flag with
**mimedefang**.

**filter_helo** is passed seven arguments: \$ip and \$name are the IP
address and name of the sending relay, as in **filter_relay**. The third
argument, \$helo, is the argument supplied in the HELO/EHLO command.

The remaining four arguments to **filter_helo** are \$port, \$myip,
\$myport and \$qid, which contain the client\'s TCP port, the Sendmail
daemon\'s listening IP address, the Sendmail daemon\'s listening port,
and the Sendmail Queue-ID, respectively. *Note* that the Queue-ID may
not yet be available at this stage (for example, Postfix does not
allocate a queue-ID this early.) If the Queue-ID is not available, the
string NOQUEUE is passed instead.

**filter_helo** must return a two-to-five element list: (\$code, \$msg,
\$smtp_code, \$smtp_dsn, \$delay). \$code is a return code, with the
same meaning as the \$code return from **filter_relay**. \$msg specifies
the text message to use for the SMTP reply. If \$smtp_code and
\$smtp_dsn are supplied, they become the SMTP numerical reply code and
the enhanced status delivery code (DSN code). If they are not supplied,
sensible defaults are used. \$delay specifies a delay in seconds; the C
milter code will sleep for \$delay seconds before returning the reply to
Sendmail. \$delay defaults to zero.

(Note that the delay is implemented in the Milter C code; if you specify
a delay of 30 seconds, that doesn\'t mean a Perl worker is tied up for
the duration of the delay. The delay only costs one Milter thread.)

# FILTERING BY SENDER

You can define a function called **filter_sender** in your filter. This
lets you reject messages from certain senders, rather than waiting until
the whole message has been sent. Note that for this check to take place,
you must use the -s flag with **mimedefang**.

**filter_sender** is passed four arguments: \$sender is the envelope
e-mail address of the sender (for example,
\"\<dfs\@roaringpenguin.com>\"). The address may or may not be
surrounded by angle brackets. \$ip and \$name are the IP address and
host name of the SMTP relay. Finally, \$helo is the argument to the SMTP
\"HELO\" command.

Inside **filter_sender**, you can access any ESMTP arguments (such as
\"SIZE=12345\") in the array \@ESMTPArgs. Each ESMTP argument occupies
one array element.

**filter_sender** must return a two-to-five element list, with the same
meaning as the return value from **filter_helo**.

For example, if you wish to reject messages from spammer\@badguy.com,
you could use this function:

    sub filter_sender {
    	my ($sender, $ip, $hostname, $helo) = @_;
    	if ($sender =~ /^<?spammer\@badguy\.com>?$/i) {
    		return ('REJECT', 'Sorry; spammer@badguy.com is blacklisted.');
    	}
    	return ('CONTINUE', "ok");
    }

As another example, some spammers identify their own machine as your
machine in the SMTP \"HELO\" command. This function rejects a machine
claiming to be in the \"roaringpenguin.com\" domain unless it really is
a Roaring Penguin machine:

    sub filter_sender {
      my($sender, $ip, $hostname, $helo) = @_;
      if ($helo =~ /roaringpenguin.com/i) {
        if ($ip ne "127.0.0.1" and
            $ip ne "216.191.236.23" and
            $ip ne "216.191.236.30") {
              return('REJECT', "Go away... $ip is not in roaringpenguin.com");
        }
      }
      return ('CONTINUE', "ok");
    }

As a third example, you may wish to prevent spoofs by requiring SMTP
authentication when email is sent from some email addresses. This
function rejects mail from \"king\@example.com\", unless the connecting
user properly authenticated as \"elvisp\". Note that this needs access
to the %SendmailMacros global, that is not available in filter_sender
until after a call to **read_commands_file**.

    sub filter_sender {
            my($sender, $ip, $hostname, $helo) = @_;
            read_commands_file();
            ### notice: This assumes The King uses authentication without realm!
            if ($sender =~ /^<?king\@example\.com>?$/i and
                $SendmailMacros{auth_authen} ne "elvisp") {
                    return('REJECT', "Faking mail from the king is not allowed.");
            }
            return ('CONTINUE', "ok");
    }

# FILTERING BY RECIPIENT

You can define a function called **filter_recipient** in your filter.
This lets you reject messages to certain recipients, rather than waiting
until the whole message has been sent. Note that for this check to take
place, you must use the -t flag with **mimedefang**.

**filter_recipient** is passed nine arguments: \$recipient is the
envelope address of the recipient and \$sender is the envelope e-mail
address of the sender (for example, \"\<dfs\@roaringpenguin.com>\"). The
addresses may or may not be surrounded by angle brackets. \$ip and
\$name are the IP address and host name of the SMTP relay. \$first is
the envelope address of the *first* recipient for this message, and
\$helo is the argument to the SMTP \"HELO\" command. The last three
arguments, \$rcpt_mailer, \$rcpt_host and \$rcpt_addr are the Sendmail
mailer, host and address triple for the recipient address. For example,
for local recipients, \$rcpt_mailer is likely to be \"local\", while for
remote recipients, it is likely to be \"esmtp\".

Inside **filter_recipient**, you can access any ESMTP arguments (such as
\"NOTIFY=never\") in the array \@ESMTPArgs. Each ESMTP argument occupies
one array element.

**filter_recipient** must return a two-to-five element list whose
interpretation is the same as for **filter_sender**. Note, however, that
if **filter_recipient** returns \'DISCARD\', then the entire message for
*all* recipients is discarded. (It doesn\'t really make sense, but
that\'s how Milter works.)

For example, if you wish to reject messages from spammer\@badguy.com,
unless they are to postmaster\@mydomain.com, you could use this
function:

    sub filter_recipient {
    	my ($recipient, $sender, $ip, $hostname, $first, $helo,
                $rcpt_mailer, $rcpt_host, $rcpt_addr) = @_;
    	if ($sender =~ /^<?spammer\@badguy\.com>?$/i) {
    		if ($recipient =~ /^<?postmaster\@mydomain\.com>?$/i) {
    			return ('CONTINUE', "ok");
    		}
    		return ('REJECT', 'Sorry; spammer@badguy.com is blacklisted.');
    	}
    	return ('CONTINUE', "ok");
    }

# INITIALIZATION AND CLEANUP

Just before a worker begins processing messages, **mimedefang.pl** calls
the functions **filter_initialize** (if it is defined) with no
arguments. By the time **filter_initialize** is called, all the other
initialization (such as setting up syslog facility and priority) has
been done.

If you are not using an embedded Perl interpreter, then performing an
action inside **filter_initialize** is practically the same as
performing it directly in the filter file, outside any function
definition. However, if you are using an embedded Perl interpreter, then
anything you call directly from outside a function definition is
executed *once only* in the parent process. Anything in
**filter_initialize** is executed *once per worker*. If you use any code
that opens a descriptor (for example, a connection to a database
server), you *must* run that code inside **filter_initialize** and not
directly from the filter, because the multiplexor closes all open
descriptors when it activates a new worker. From within
**filter_initialize** a configuration file could be loaded by calling
**read_config**. **read_config** accepts a configuration file path and
it can be used to overwrite global variables. Configuration file format
is pure Perl code.

When a worker is about to exit, **mimedefang.pl** calls the function
**filter_cleanup** (if it is defined) with no arguments. This function
can do whatever cleanup you like, such as closing file descriptors and
cleaning up long-lived worker resources. The return value from
**filter_cleanup** becomes the worker\'s exit status. (You should
therefore ensure that **filter_cleanup** returns an integer suitable for
a process exit status.)

If **filter_cleanup** takes longer than 10 seconds to run, the worker is
sent a SIGTERM signal. If that doesn\'t kill it (because you\'re
catching signals, perhaps), then a further 10 seconds later, the worker
is sent a SIGKILL signal.

# CONTROLLING PARSING

If you define a function called **filter_create_parser** taking no
arguments, then **mimedefang.pl** will call it to create a MIME::Parser
object for parsing mail messages.

**Filter_create_parser** is expected to return a MIME::Parser object (or
an instance of a class derived from MIME::Parser).

You can use **filter_create_parser** to change the behavior of the
MIME::Parser used by **mimedefang.pl**.

If you do not define a **filter_create_parser** function, then a
built-in version equivalent to this is used:

    	sub filter_create_parser () {
    		my $parser = MIME::Parser->new();
    		$parser->extract_nested_messages(1);
    		$parser->extract_uuencode(1);
    		$parser->output_to_core(0);
    		$parser->tmp_to_core(0);
    		return $parser;
    	}

# EXTENDING MIMEDEFANG

The man page for **mimedefang-protocol**(7) lists commands that are
passed to workers in server mode (see \"SERVER COMMANDS\".) You can
define a function called **filter_unknown_cmd** to extend the set of
commands your filter can handle.

If you define **filter_unknown_cmd**, it is passed the unknown command
as a single argument. It should return a list of values as follows: The
first element of the list must be either \"ok\" or \"error:\" (with the
colon.) The remaining arguments are percent-encoded. All the resulting
pieces are joined together with a single space between them, and the
resulting string passed back as the reply to the multiplexor.

For example, the following function will make your filter reply to a
\"PING\" command with \"PONG\":

    sub filter_unknown_cmd ($) {
        my($cmd) = @_;
        if ($cmd eq "PING") {
            return("ok", "PONG");
        }
        return("error:", "Unknown command");
    }

You can test this filter by typing the following as root:

    md-mx-ctrl PING

The response should be:

    ok PONG

If you extend the set of commands using **filter_unknown_cmd**, you
should make all your commands start with an upper-case letter to avoid
clashes with future built-in commands.

# REJECTING UNKNOWN USERS EARLY

A very common mail setup is to have a MIMEDefang machine act as an SMTP
proxy, accepting and scanning mail and then relaying it to the real mail
server. Unfortunately, this means that the MIMEDefang machine cannot
know if a local address is valid or not, and will forward all mail for
the appropriate domains. If a mail comes in for an unknown user, the
MIMEDefang machine will be forced to generate a bounce message when it
tries to relay the mail.

It\'s often desirable to have the MIMEDefang host reply with a \"User
unknown\" SMTP response directly. While this can be done by copying the
list of local users to the MIMEDefang machine, MIMEDefang has a built-in
function called **md_check_against_smtp_server** for querying another
relay host:

**md_check_against_smtp_server(\$sender, \$recip, \$helo, \$server, \$port) This**

:   function connects to the SMTP server \$server and pretends to send
    mail from \$sender to \$recip. The return value is always a
    two-element array. If the RCPT TO: command succeeds, the return
    value is (\"CONTINUE\", \"OK\"). If the RCPT fails with a permanent
    failure, the return value is (\"REJECT\", \$msg), where \$msg is the
    message from the SMTP server. Any temporary failures, connection
    errors, etc. result in a return value of (\"TEMPFAIL\", \$msg).

The optional argument \$port specifies the TCP port to connect to. If it
is not supplied, then the default SMTP port of 25 is used.

If the server offers STARTTLS support, TLS step-up is attempted. If TLS
step-up fails, the check will fall-back to using clear text and log the
failure

Suppose the machine **filter.domain.tld** is filtering mail destined for
the real mail server **mail.domain.tld**. You could have a
**filter_recipient** function like this:

    sub filter_recipient
    {
        my($recip, $sender, $ip, $host, $first, $helo,
           $rcpt_mailer, $rcpt_host, $rcpt_addr) = @_;
        return md_check_against_smtp_server($sender, $recip,
    					"filter.domain.tld",
    					"mail.domain.tld");
    }

For each RCPT TO: command, MIMEDefang opens an SMTP connection to
**mail.domain.tld** and checks if the command would succeed.

Please note that you should only use **md_check_against_smtp_server** if
your mail server responds with a failure code for nonexistent users at
the RCPT TO: level. Also, this function may impose too much overhead if
you receive a lot of e-mail, and it will generate lots of useless log
entries on the real mail server (because of all the RCPT TO: probes.) It
may also significantly increase the load on the real mail server.

# GLOBAL VARIABLES YOU CAN SET

The following Perl global variables should be set in
**mimedefang-filter**:

**\$AdminAddress**

:   The e-mail address of the MIMEDefang administrator.

**\$DaemonAddress**

:   The e-mail address from which MIMEDefang-originated notifications
    come.

**\$AddWarningsInline**

:   If this variable is set to 0, then all MIMEDefang warnings (such as
    created by action_quarantine or action_drop_with_warning) are
    collected together and added in a separate MIME part called
    WARNING.TXT. If the variable is set to 1, then the warnings are
    added directly in the first text/plain and text/html parts of the
    message. If the message does not contain any text/plain or text/html
    parts, then a WARNING.TXT MIME part is added as before.

**\$MaxMIMEParts**

:   A message containing many MIME parts can cause MIME::Tools to
    consume large amounts of memory and bring your system to its knees.
    If you set \$MaxMIMEParts to a positive number, then MIME parsing is
    terminated for messages with more than that many parts, and the
    message is bounced. In this case, *none* of your filter functions is
    called.

By default, \$MaxMIMEParts is set to -1, meaning there is no limit on
the number of parts in a message. Note that in order to use this
variable, you *must* install the Roaring Penguin patched version of
MIME::Tools, version 5.411a-RP-Patched-02 or newer.

**\$Stupidity{\"NoMultipleInlines\"}**

:   Set this to 1 if your e-mail is too stupid to display multiple MIME
    parts in-line. In this case, a nasty hack causes the first part of
    the original message to appear as an attachment if warning are
    issued. Mail clients that are not this stupid are Netscape
    Communicator and Pine. On the other hand, Microsoft Exchange and
    Microsoft Outlook are indeed this stupid. Perhaps users of those
    clients should switch.

The following global variables may optionally be set. If they are not
set, sensible defaults are used:

**\$AddApparentlyToForSpamAssassin**

:   By default, MIMEDefang tries to pass SpamAssassin a message that
    looks exactly like one it would receive via procmail. This means
    adding a Received: header, adding a Message-ID header if necessary,
    and adding a Return-Path: header. If you set
    \$AddApparentlyToForSpamAssassin to 1, then MIMEDefang also adds an
    Apparently-To: header with all the envelope recipients before
    passing the message to SpamAssassin. This lets SpamAssassin detect
    possibly whitelisted recipient addresses.

The default value for \$AddApparentlyToForSpamAssassin is 0.

**\$SyslogFacility**

:   This specifies the logging facility used by mimedefang.pl. By
    default, it is set to \"mail\", but you can set it to other
    possibilites. See the openlog(3) man page for details. You should
    name facilities as all-lowercase without the leading \"LOG\_\". That
    is, use \"local3\", not \"LOG_LOCAL3\".

**\$WarningLocation (default 0)**

:   If set to 0 (the default), non-inline warnings are placed first. If
    you want the warning at the end of the e-mail, set \$WarningLocation
    to -1.

**\$DaemonName (default \"\"\"MIMEDefang\"\")**

:   The full name used when MIMEDefang sends out notifications.

**\$AdminName (default \"\"\"MIMEDefang Administrator\"\")**

:   The full name of the MIMEDefang administrator.

**\$SALocalTestsOnly (default 1)**

:   If set to 1, SpamAssassin calls will use only local tests. This is
    the default and recommended setting. This disables Received, RBL and
    Razor tests in an all or nothing fashion. To use Razor this **MUST**
    be set to 0. You can add \'skip_rbl_checks 1\' to your SpamAssassin
    config file if you need to.

**\$NotifySenderSubject (default \"\"\"MIMEDefang Notification\"\")**

:   The subject used when e-mail is sent out by action_notify_sender().
    If you set this, you should set it each time you call
    action_notify_sender() to ensure consistency.

**\$NotifyAdministratorSubject (default \"\"\"MIMEDefang Notification\"\")**

:   The subject used when e-mail is sent out by
    action_notify_administrator(). If you set this, you should set it
    each time you call action_notify_administrator() to ensure
    consistency.

**\$QuarantineSubject (default \"\"\"MIMEDefang Quarantine Report\"\")**

:   The subject used when a quarantine notice is sent to the
    administrator. If you set this, you should set it each time you call
    action_quarantine() or action_quarantine_entire_message().

**\$NotifyNoPreamble (default 0)**

:   Normally, notifications sent by action_notify_sender() have a
    preamble warning about message modifications. If you do not want
    this, set \$NotifyNoPreamble to 1.

**\$CSSHost (default 127.0.0.1:7777:local)**

:   Host and port for the Symantec CarrierScan Server virus scanner.
    This takes the form *ip_addr*:*port*:*local_or_nonlocal*. The
    *ip_addr* and *port* are the host and port on which CarrierScan
    Server is listening. If you want to scan local files, append :local
    to force the use of the AVSCANLOCAL command. If the CarrierScan
    Server is on another host, append :nonlocal to force the file
    contents to be sent to the scanner over the socket.

**\$SophieSock (default /var/spool/MIMEDefang/sophie)**

:   Socket used for Sophie daemon calls within
    message_contains_virus_sophie and entity_contains_virus_sophie
    unless a socket is provided by the calling routine.

**\$ClamdSock (default /var/spool/MIMEDefang/clamd.sock)**

:   Socket used for clamd daemon calls within
    message_contains_virus_clamd and entity_contains_virus_clamd unless
    a socket is provided by the calling routine.

**\$TrophieSock (default /var/spool/MIMEDefang/trophie)**

:   Socket used for Trophie daemon calls within
    message_contains_virus_trophie and entity_contains_virus_trophie
    unless a socket is provided by the calling routine.

# FILTER

The heart of **mimedefang-filter** is the **filter** procedure. See the
examples that came with MIMEDefang to learn to write a filter. The
filter is called with the following arguments:

**\$entity**

:   The MIME::Entity object. (See the MIME::tools Perl module
    documentation.)

**\$fname**

:   The suggested attachment filename, or \"\" if none was supplied.

**\$ext**

:   The file extension (all characters from the rightmost period to the
    end of the filename.)

**\$type**

:   The MIME type (for example, \"text/plain\".)

The filename is derived as follows:

o

:   First, if the Content-Disposition header has a \"filename\" field,
    it is used.

o

:   Otherwise, if the Content-Type header has a \"name\" field, it is
    used.

o

:   Otherwise, the Content-Description header value is used.

Note that the truly paranoid will check all three fields for matches.
The functions **re_match** and **re_match_ext** perform regular
expression matches on all three of the fields named above, and return 1
if any field matches. See the sample filters for details. The calling
sequence is:

    	re_match($entity, "regexp")
    	re_match_ext($entity, "regexp")

**re_match** returns true if any of the fields matches the regexp
without regard to case. **re_match_ext** returns true if the extension
in any field matches. An extension is defined as the last dot in a name
and all remaining characters.

A third function called **re_match_in_zip_directory** will look inside
zip files and return true if any of the file names inside the zip
archive match the regular expression. Call it like this:

    	my $bh = $entity->bodyhandle();
    	my $path = (defined($bh)) ? $bh->path() : undef;
    	if (defined($path) and re_match_in_zip_directory($path, "regexp")) {
    	    # Take action...
    	}

You should *not* call **re_match_in_zip_directory** unless you know that
the entity is a zip file attachment.

Another function called **re_match_in_rar_directory** will look inside
rar files and return true if any of the file names inside the rar
archive match the regular expression. The function is very similar to
**re_match_in_zip_directory** but the unrar binary is required and must
be specified in **\$Features{\"unrar\"}**.

Another function called **re_match_in_7z_directory** will look inside
7zip files and return true if any of the file names inside the 7zip
archive match the regular expression. The function is very similar to
**re_match_in_zip_directory** but the 7z binary is required and must be
specified in **\$Features{\"7zip\"}**.

# GLOBAL VARIABLES SET BY MIMEDEFANG.PL

The following global variables are set by **mimedefang.pl** and are
available for use in your filter. All of these variables are always
available to filter_begin, filter, filter_multipart and filter_end. In
addition, some of them are available in **filter_relay**,
**filter_sender** or **filter_recipient**. If this is the case, it will
be noted below.

**%Features**

:   This hash lets you determine at run-time whether certain
    functionality is available. This hash is available at all times
    assuming the detect_and_load_perl_modules() function has been
    called. The defined features are:

\$Features{\"SpamAssassin\"} is 1 if SpamAssassin 1.6 or better is
installed; 0 otherwise.

\$Features{\"HTML::Parser\"} is 1 if HTML::Parser is installed; 0
otherwise.

\$Features{\"Virus:FPROTD\"} is currently always 0. Set it to 1 in your
filter file if you have F-Risk\'s FPROTD scanner earlier than version 6.

\$Features{\"Virus:FPROTD6\"} is currently always 0. Set it to 1 in your
filter file if you have version 6 of F-Risk\'s FPROTD scanner.

\$Features{\"Virus:SymantecCSS\"} is currently always 0. Set it to 1 in
your filter file if you have the Symantec CarrierScan Server virus
scanner.

\$Features{\"Virus:NAI\"} is the full path to NAI uvscan if it is
installed; 0 if it is not.

\$Features{\"Virus:BDC\"} is the full path to Bitdefender bdc if it is
installed; 0 if it is not.

\$Features{\"Virus:NVCC\"} is the full path to Norman Virus Control nvcc
if it is installed; 0 if it is not.

\$Features{\"Virus:HBEDV\"} is the full path to H+BEDV AntiVir if it is
installed; 0 if it is not.

\$Features{\"Virus:VEXIRA\"} is the full path to Central Command Vexira
if it is installed; 0 if it is not.

\$Features{\"Virus:SOPHOS\"} is the full path to Sophos sweep if it is
installed; 0 if it is not.

\$Features{\"Virus:SAVSCAN\"} is the full path to Sophos savscan if it
is installed; 0 if it is not.

\$Features{\"Virus:CLAMAV\"} is the full path to Clam AV clamscan if it
is installed; 0 if it is not.

\$Features{\"Virus:AVP\"} is the full path to AVP AvpLinux if it is
installed; 0 if it is not.

\$Features{\"Virus:AVP5\"} is the full path to Kaspersky \"aveclient\"
if it is installed; 0 if it is not.

\$Features{\"Virus:CSAV\"} is the full path to Command csav if it is
installed; 0 if it is not.

\$Features{\"Virus:FSAV\"} is the full path to F-Secure fsav if it is
installed; 0 if it is not.

\$Features{\"Virus:FPROT\"} is the full path to F-Risk f-prot if it is
installed; 0 if it is not.

\$Features{\"Virus:FPSCAN\"} is the full path to F-Risk fpscan if it is
installed; 0 if it is not.

\$Features{\"Virus:SOPHIE\"} is the full path to Sophie if it is
installed; 0 if it is not.

\$Features{\"Virus:CLAMD\"} is the full path to clamd if it is
installed; 0 if it is not.

\$Features{\"Virus:CLAMDSCAN\"} is the full path to clamdscan if it is
installed; 0 if it is not.

\$Features{\"Virus:TROPHIE\"} is the full path to Trophie if it is
installed; 0 if it is not.

\$Features{\"Virus:NOD32\"} is the full path to ESET NOD32 nod32cli if
it is installed; 0 if it is not.

\$Features{\"Path:RSPAMC\"} is the full path to rspamc(1) if it is
installed (deprecated); 0 if it is not.

**NOTE:** Perl-module based features such as SpamAssassin are determined
at runtime and may change as these are added and removed. Most Virus
features are predetermined at the time of configuration and do not adapt
to runtime availability unless changed by the filter rules.

**\$CWD**

:   This variable holds the working directory for the current message.
    During filter processing, **mimedefang.pl** chdir\'s into this
    directory before calling any of the filter\_ functions. Note that
    this variable *is* set correctly in **filter_sender** and
    **filter_recipient**, but *not* in **filter_relay**.

**\$SuspiciousCharsInHeaders**

:   If this variable is true, then **mimedefang** has discovered
    suspicious characters in message headers. This might be an exploit
    for bugs in MIME-parsing routines in some badly-written mail user
    agents (e.g. Microsoft Outlook.) You should *always* drop such
    messages.

**\$SuspiciousCharsInBody**

:   If this variable is true, then **mimedefang** has discovered
    suspicious characters in the message body. This might be an exploit
    for bugs in MIME-parsing routines in some badly-written mail user
    agents (e.g. Microsoft Outlook.) You should *always* drop such
    messages.

**\$RelayHostname**

:   The host name of the relay. This is the name of the host that is
    attempting to send e-mail to your host. May be \"undef\" if the host
    name could not be determined. This variable is available in
    **filter_relay**, **filter_sender** and **filter_recipient** in
    addition to the body filtering functions.

**\$RelayAddr**

:   The IP address of the sending relay (as a string consisting of four
    dot-separated decimal numbers.) One potential use of **\$RelayAddr**
    is to limit mailing to certain lists to people within your
    organization. This variable is available in **filter_relay**,
    **filter_sender** and **filter_recipient** in addition to the body
    filtering functions.

**\$Helo** The argument given to the SMTP \"HELO\" command. This
variable is available in **filter_sender** and **filter_recipient**, but
*not* in **filter_relay**.

**\$Subject**

:   The contents of the \"Subject:\" header.

**\$Sender**

:   The sender of the e-mail. This variable is set in **filter_sender**
    and **filter_recipient** in addition to the body filtering
    functions.

**\@Recipients**

:   A list of the recipients. In **filter_recipient**, it is set to the
    single recipient currently under consideration. Or, after calling
    **read_commands_file** within **filter_recipient**, the current
    recipient under consideration is in the final position of the array,
    at **\$Recipients\[-1\]**, while any previous (and accepted)
    recipients are at the beginning of the array, that is, in
    **\@Recipients\[0 .. \$#Recipients-1\]**.

**\$MessageID**

:   The contents of the \"Message-ID:\" header if one is present.
    Otherwise, contains the string \"NOQUEUE\".

**\$QueueID**

:   The Sendmail queue identifier if it could be determined. This
    variable *is* set correctly in **filter_relay**, **filter_helo**,
    **filter_sender** and **filter_recipient**. Note, however, that
    Postfix may not allocate a queue ID until **filter_recipient** time.
    If a Queue-ID has not yet been allocated, \$QueueID is set to
    \"NOQUEUE\".

**\$MsgID**

:   Set to \$QueueID if the queue ID could be determined; otherwise, set
    to \$MessageID. This identifier should be used in logging, because
    it matches the identifier used by Sendmail to log messages. Note
    that this variable *is* set correctly in **filter_sender** and
    **filter_recipient**, but it is *not* available in **filter_relay**.

**\$VirusScannerMessages**

:   Each time a virus-scanning function is called, messages (if any)
    from the virus scanner are accumulated in this variable. You can use
    it in filter_end to formulate a notification (if you wish.)

**\$VirusName**

:   If a virus-scanning function found a virus, this variable will hold
    the virus name (if it could be determined.)

**\$SASpamTester**

:   If defined, this is the configured Mail::SpamAssassin object used
    for mail tests. It may be initialized with a call to
    **spam_assassin_init** which also returns it.

**%SendmailMacros**

:   This hash contains the values of some Sendmail macros. The hash
    elements exist only for macros defined by Sendmail. See the Sendmail
    documentation for the meanings of the macros.

By default, **mimedefang** passes the values of the following macros:
\${daemon_name}, \${daemon_port}, \${if_name}, \${if_addr}, \$j, \$\_,
\$i, \${tls_version}, \${cipher}, \${cipher_bits}, \${cert_subject},
\${cert_issuer}, \${auth_type}, \${auth_authen}, \${auth_ssf},
\${auth_author}, \${mail_mailer}, \${mail_host} and \${mail_addr}. In
addition, \${client_port} is set to the client\'s TCP port.

If any macro is not set or not passed to milter, it will be unavailable.
To access the value of a macro, use:


    	$SendmailMacros{"macro_name"}

Do not place curly brackets around the macro name. This variable is
available in **filter_sender** and **filter_recipient** after a call to
**read_commands_file**.

**\@SenderESMTPArgs**

:   This array contains all the ESMTP arguments supplied in the MAIL
    FROM: command. For example:

```{=html}
<!-- -->
```
    sub print_sender_esmtp_args {
        foreach (@SenderESMTPArgs) {
            print STDERR "Sender ESMTP arg: $_;
        }
    }

**%RecipientESMTPArgs**

:   This hash contains all the ESMTP arguments supplied in each RCPT TO:
    command. For example:

```{=html}
<!-- -->
```
    sub print_recip_esmtp_args {
        foreach my $recip (@Recipients) {
            foreach(@{$RecipientESMTPArgs{$recip}}) {
                print STDERR "Recip ESMTP arg for $recip: $_;
            }
        }
    }

**%RecipientMailers**

:   This hash contains the Sendmail \"mailer-host-address\" triple for
    each recipient. Here\'s an example of how to use it:

```{=html}
<!-- -->
```
    sub print_mailer_info {
        my($recip, $mailer, $host, $addr);
        foreach $recip (@Recipients) {
            $mailer = ${RecipientMailers{$recip}}[0];
            $host = ${RecipientMailers{$recip}}[1];
            $addr =  ${RecipientMailers{$recip}}[2];
            print STDERR "$recip: mailer=$mailer, host=$host, addr=$addr\n";
        }
    }

In **filter_recipient**, this variable by default only contains
information on the recipient currently under investigation. Information
on all recipients is available after calling **read_commands_file**.

# ACTIONS

When the filter procedure decides how to dispose of a part, it should
call one or more **action\_** subroutines. The action subroutines are:

**action_accept()**

:   Accept the part.

**action_rebuild() **

:   Rebuild the mail body, even if **mimedefang** thinks no changes were
    made. Normally, **mimedefang** does not alter a message if no
    changes were made. **action_rebuild** may be used if you make
    changes to entities directly (by manipulating the MIME::Head, for
    example.) Unless you call **action_rebuild**, **mimedefang** will be
    unaware of the changes. Note that all the built-in **action\...**
    routines that change a message implicitly call **action_rebuild**.

**action_add_header(\$hdr, \$val)**

:   Add a header to the message. This can be used in **filter_begin** or
    **filter_end**. The \$hdr component is the header name *without the
    colon*, and the \$val is the header value. For example, to add the
    header:

```{=html}
<!-- -->
```
    	X-MyHeader: A nice piece of text

use:

    	action_add_header("X-MyHeader", "A nice piece of text");

**action_change_header(\$hdr, \$val, \$index)**

:   Changes an existing header in the message. This can be used in
    **filter_begin** or **filter_end**. The \$hdr parameter is the
    header name *without the colon*, and \$val is the header value. If
    the header does not exist, then a header with the given name and
    value is added.

The \$index parameter is optional; it defaults to 1. If you supply it,
then the \$index\'th occurrence of the header is changed, if there is
more than one header with the same name. (This is common with the
Received: header, for example.)

**action_insert_header(\$hdr, \$val, \$index)**

:   Add a header to the message int the specified position \$index. A
    position of 0 specifies that the header should be prepended before
    existing headers. This can be used in **filter_begin** or
    **filter_end**. The \$hdr component is the header name *without* the
    colon, and the \$val is the header value.

**action_delete_header(\$hdr, \$index)**

:   Deletes an existing header in the message. This can be used in
    **filter_begin** or **filter_end**. The \$hdr parameter is the
    header name *without the colon*.

The \$index parameter is optional; it defaults to 1. If you supply it,
then the \$index\'th occurrence of the header is deleted, if there is
more than one header with the same name.

**action_delete_all_headers(\$hdr)**

:   Deletes all headers with the specified name. This can be used in
    **filter_begin** or **filter_end**. The \$hdr parameter is the
    header name *without the colon*.

**action_drop()**

:   Drop the part. If called from **filter_multipart**, drops all
    contained parts also.

**action_drop_with_warning(\$msg)**

:   Drop the part, but add the warning *\$msg* to the e-mail message. If
    called from **filter_multipart**, drops all contained parts also.

**action_accept_with_warning(\$msg)**

:   Accept the part, but add the warning *\$msg* to the e-mail message.

**action_replace_with_warning(\$msg)**

:   Drop the part and replace it with a text part *\$msg*. If called
    from **filter_multipart**, drops all contained parts also.

**action_replace_with_url(\$entity, \$doc_root, \$base_url, \$msg, \[\$cd_data, \$salt\])**

:   Drop the part, but save it in a unique location under \$doc_root.
    The part is replaced with the text message \$msg. The string
    \"\_URL\_\" in \$msg is replaced with \$base_url/something, that can
    be used to retrieve the message.

You should not use this function in **filter_multipart**.

This action is intended for stripping large parts out of the message and
replacing them to a link on a Web server. Here\'s how you would use it
in filter():

    $size = (stat($entity->bodyhandle->path))[7];
    if ($size > 1000000) {
    	return action_replace_with_url($entity,
    		"/home/httpd/html/mail_parts",
    		"http://mailserver.company.com/mail_parts",
    		"The attachment was larger than 1,000,000 bytes.\n" .
    		"It was removed, but may be accessed at this URL:\n\n" .
    		"\t_URL_\n");
    }

This example moves attachments greater than 1,000,000 bytes into
/home/httpd/html/mail_parts and replaces them with a link. The directory
should be accessible via a Web server at
http://mailserver.company.com/mail_parts.

The generated name is created by performing a SHA1 hash of the part and
adding the extension to the ASCII-HEX representation of the hash. If
many different e-mails are sent containing an identical large part, only
one copy of the part is stored, regardless of the number of senders or
recipients.

For privacy reasons, you **must** turn off Web server indexing in the
directory in which you place mail parts, or anyone will be able to read
them. If indexing is disabled, an attacker would have to guess the SHA1
hash of a part in order to read it.

Optionally, a fifth argument can supply data to be saved into a hidden
dot filename based on the generated name. This data can then be read in
on the fly by a CGI script or mod_perl module before serving the file to
a web client, and used to add information to the response, such as
Content-Disposition data.

A sixth optional argument, \$salt, is mixed in to the SHA1 hash. This
salt can be any string and should be kept confidential. The salt is
designed to prevent people from guessing whether or not a particular
attachment has been received on your server by altering the SHA1 hash
calculation.

**action_defang(\$entity, \$name, \$fname, \$type)**

:   Accept the part, but change its name to *\$name*, its suggested
    filename to *\$fname* and its MIME type to *\$type*. If *\$name* or
    *\$fname* are \"\", then **mimedefang.pl** generates generic names.
    Do not use this action in **filter_multipart**.

If you use **action_defang**, you must define a subroutine called
**defang_warning** in your filter. This routine takes two arguments:
\$oldfname (the original name of an attachment) and \$fname (the
defanged version.) It should return a message telling the user what
happened. For example:

    sub defang_warning {
        my($oldfname, $fname) = @_;
        return "The attachment '$oldfname' was renamed to '$fname'\n";
    }

**action_external_filter(\$entity, \$cmd)**

:   Run an external UNIX command **\$cmd**. This command must read the
    part from the file **./FILTERINPUT** and leave the result in
    **./FILTEROUTPUT**. If the command executes successfully, returns 1,
    otherwise 0. You can test the return value and call another
    **action\_** if the filter failed. Do not use this action in
    **filter_multipart**.

**action_quarantine(\$entity, \$msg)**

:   Drop and quarantine the part, but add the warning *\$msg* to the
    e-mail message.

**action_quarantine_entire_message(\$msg)**

:   Quarantines the entire message in a quarantine directory on the mail
    server, but does not otherwise affect disposition of the message. If
    \"\$msg\" is non-empty, it is included in any administrator
    notification.

**action_sm_quarantine(\$reason)**

:   Quarantines a message *in the Sendmail mail queue* using the new
    QUARANTINE facility of Sendmail 8.13. Consult the Sendmail
    documentation for details about this facility. If you use
    **action_sm_quarantine** with a version of Sendmail that lacks the
    QUARANTINE facility, **mimedefang** will log an error message and
    not quarantine the message.

**action_bounce(\$reply, \$code, \$dsn)**

:   Reject the entire e-mail message with an SMTP failure code, and the
    one-line error message *\$reply*. If the optional \$code and \$dsn
    arguments are supplied, they specify the numerical SMTP reply code
    and the extended status code (DSN code). If the codes you supply do
    not make sense for a bounce, they are replaced with \"554\" and
    \"5.7.1\" respectively.

**action_bounce** merely makes a note that the message is to be bounced;
remaining parts are still processed. If **action_bounce** is called for
more than one part, the mail is bounced with the message in the final
call to **action_bounce**. You can profitably call **action_quarantine**
followed by **action_bounce** if you want to keep a copy of the
offending part. Note that the message is not bounced immediately;
rather, remaining parts are processed and the message is bounced after
all parts have been processed.

Note that despite its name, **action_bounce** does *not* generate a
\"bounce message\". It merely rejects the message with an SMTP failure
code.

**WARNING:** **action_bounce()** may cause the sending relay to generate
spurious bounce messages if the sender address is faked. This is a
particular problem with viruses. However, we believe that on balance,
it\'s better to bounce a virus than to silently discard it. It\'s almost
never a good idea to hide a problem.

**action_tempfail(\$msg, \$code, \$dsn)**

:   Cause an SMTP \"temporary failure\" code to be returned, so the
    sending mail relay requeues the message and tries again later. The
    message \$msg is included with the temporary failure code. If the
    optional \$code and \$dsn arguments are supplied, they specify the
    numerical SMTP reply code and the extended status code (DSN code).
    If the codes you supply do not make sense for a temporary failure,
    they are replaced with \"450\" and \"4.7.1\" respectively.

**action_discard()**

:   Silently discard the message, notifying nobody. You can profitably
    call **action_quarantine** followed by **action_discard** if you
    want to keep a copy of the offending part. Note that the message is
    not discarded immediately; rather, remaining parts are processed and
    the message is discarded after all parts have been processed.

**action_notify_sender(\$message)**

:   This action sends an e-mail back to the original sender with the
    indicated message. You may call another action after this one. If
    **action_notify_sender** is called more than once, the messages are
    accumulated into a single e-mail message \-- at most one
    notification message is sent per incoming message. The message
    should be terminated with a newline.

The notification is delivered in deferred mode; you should run a
client-queue runner if you are using Sendmail 8.12.

*NOTE*: Viruses often fake the sender address. For that reason, if a
virus-scanner has detected a virus, **action_notify_sender** is
*disabled* and will simply log an error message if you try to use it.

**action_notify_administrator(\$message)**

:   This action e-mails the MIMEDefang administrator the supplied
    message. You may call another action after this one;
    **action_notify_administrator** does not affect mail processing. If
    **action_notify_administrator** is called more than once, the
    messages are accumulated into a single e-mail message \-- at most
    one notification message is sent per incoming message. The message
    should be terminated with a newline.

The notification is delivered in deferred mode; you should run a
client-queue runner if you are using Sendmail 8.12.

**append_text_boilerplate(\$entity, \$boilerplate, \$all)**

:   This action should *only* be called from **filter_end**. It appends
    the text \"\\n\$boilerplate\\n\" to the first text/plain part (if
    \$all is 0) or to *all* text/plain parts (if \$all is 1).

**append_html_boilerplate(\$entity, \$boilerplate, \$all)**

:   This action should *only* be called from **filter_end**. It adds the
    text \"\\n\$boilerplate\\n\" to the first text/html part (if \$all
    is 0) or to *all* text/html parts (if \$all is 1). This function
    tries to be smart about inserting the boilerplate; it uses
    HTML::Parser to detect closing tags and inserts the boilerplate
    before the \</body> tag if there is one, or before the \</html> tag
    if there is no \</body>. If there is no \</body> or \</html> tag, it
    appends the boilerplate to the end of the part.

Do not use append_html_boilerplate unless you have installed the
HTML::Parser Perl module.

Here is an example illustrating how to use the boilerplate functions:

    	sub filter_end {
    		my($entity) = @_;
    		append_text_boilerplate($entity,
    			"Lame text disclaimer", 0);
    		append_html_boilerplate($entity,
    			"<em>Lame</em> HTML disclaimer", 0);
    	}

**action_add_part(\$entity, \$type, \$encoding, \$data, \$fname, \$disposition \[, \$offset\])**

:   This action should *only* be called from the **filter_end** routine.
    It adds a new part to the message, converting the original message
    to mutipart if necessary. The function returns the part so that
    additional mime attributes may be set on it. Here\'s an example:

```{=html}
<!-- -->
```
    	sub filter_end {
    		my($entity) = @_;

    		action_add_part($entity, "text/plain", "-suggest",
     				"This e-mail does not represent" .
    				"the official policy of FuBar, Inc.\n",
    				"disclaimer.txt", "inline");
            }

The \$entity parameter *must* be the argument passed in to
**filter_end**. The \$offset parameter is optional; if omitted, it
defaults to -1, which adds the new part at the end. See the MIME::Entity
man page and the **add_part** member function for the meaning of
\$offset.

Note that **action_add_part** tries to be more intelligent than simply
calling \$entity-\>add_part. The decision process is as follows:

**o**

:   If the top-level entity is multipart/mixed, then the part is simply
    added.

**o**

:   Otherwise, a new top-level multipart/mixed container is generated,
    and the original top-level entity is made the first part of the
    multipart/mixed container. The new part is then added to the
    multipart/mixed container.

**action_add_entity(\$entity \[, \$offset\])**

:   This is similar to **action_add_part** but takes a pre-built
    MIME::Entity object rather than constructing one based on \$type,
    \$encoding, \$data, \$fname and \$disposition arguments.

# USEFUL ROUTINES

**mimedefang.pl** includes some useful functions you can call from your
filter:

**detect_and_load_perl_modules()**

:   Unless you *really* know what you\'re doing, this function **must**
    be called first thing in your filter file. It causes
    **mimedefang.pl** to detect and load Perl modules such as
    Mail::SpamAssassin, Net::DNS, etc., and to populate the %Features
    hash.

**send_quarantine_notifications()**

:   This function should be called from **filter_end**. If any parts
    were quarantined, a quarantine notification is sent to the
    MIMEDefang administrator. Please note that if you do not call
    **send_quarantine_notifications**, then *no* quarantine
    notifications are sent.

**get_quarantine_dir()**

:   This function returns the full path name of the quarantine
    directory. If you have not yet quarantined any parts of the message,
    a quarantine directory is created and its pathname returned.

**change_sender(\$sender)**

:   This function changes the envelope sender to \$sender. It can only
    be called from **filter_begin** or any later function. Please note
    that this function is *only* supported with Sendmail/Milter 8.14.0
    or newer. It has *no effect* if you\'re running older versions.

**add_recipient(\$recip)**

:   This function adds \$recip to the list of envelope recipients. A
    copy of the message (after any modifications by MIMEDefang) will be
    sent to \$recip in addition to the original recipients. Note that
    **add_recipient** does *not* modify the \@Recipients array; it just
    makes a note to Sendmail to add the recipient.

**delete_recipient(\$recip)**

:   This function deletes \$recip from the list of recipients. That
    person will not receive a copy of the mail. \$recip should exactly
    match an entry in the \@Recipients array for delete_recipient() to
    work. Note that **delete_recipient** does *not* modify the
    \@Recipients array; it just makes a note to Sendmail to delete the
    recipient.

**resend_message(\$recip1, \$recip2, \...)**

:   or

**resend_message(\@recips)**

:   This function *immediately* resends the *original, unmodified* mail
    message to each of the named recipients. The sender\'s address is
    preserved. Be very careful when using this function, because it
    resends the *original* message, which may contain undesired
    attachments. Also, you should *not* call this function from
    filter(), because it resends the message *each time* it is called.
    This may result in multiple copies being sent if you are not
    careful. Call from filter_begin() or filter_end() to be safe.

The function returns true on success, or false if it fails.

Note that the resend_message function delivers the mail in deferred mode
(using Sendmail\'s \"-odd\" flag.) You *must* run a client-submission
queue processor if you use Sendmail 8.12. We recommend executing this
command as part of the Sendmail startup sequence:

    	sendmail -Ac -q5m

**remove_redundant_html_parts(\$entity)**

:   This function should only be called from **filter_end**. It removes
    redundant HTML parts from the message. It works by deleting any part
    of type text/html from the message if (1) it is a sub-part of a
    multipart/alternative part, and (2) there is another part of type
    text/plain under the multipart/alternative part.

**replace_entire_message(\$entity)**

:   This function can only be called from **filter_end**. It replaces
    the entire message with \$entity, a MIME::Entity object that you
    have constructed. You can use any of the MIME::Tools functions to
    construct the entity.

**read_commands_file()**

:   This function should only be called from **filter_sender** and
    **filter_recipient**. This will read the **COMMANDS** file (as
    described in mimedefang-protocol(7)), and will fill or update the
    following global variables: \$Sender, \@Recipients,
    %RecipientMailers, \$RelayAddr, \$RealRelayAddr, \$RelayHostname,
    \$RealRelayHostname, \$QueueID, \$Helo, %SendmailMacros.

If you do not call **read_commands_file**, then the only information
available in **filter_sender** and **filter_recipient** is that which is
passed as an argument to the function.

**stream_by_domain()**

:   *Do not use this function unless you have Sendmail 8.12 and
    locally-* submitted e-mail is submitted using SMTP.

This function should *only* be called at the very beginning of
filter_begin(), like this:

    	sub filter_begin {
    		if (stream_by_domain()) {
    			return;
    		}
    		# Rest of filter_begin
    	}

stream_by_domain() looks at all the recipients of the message, and if
they belong to the same domain (e.g., joe\@domain.com, jane\@domain.com
and sue\@domain.com), it returns 0 and sets the global variable \$Domain
to the domain (domain.com in this example.)

If users are in different domains, stream_by_domain() *resends* the
message (once to each domain) and returns 1 For example, if the original
recipients are joe\@abc.net, jane\@xyz.net and sue\@abc.net, the
original message is resent twice: One copy to joe\@abc.net and
sue\@abc.net, and another copy to jane\@xyz.net. Also, any subsequent
scanning is canceled (filter() and filter_end() will *not* be called for
the original message) and the message is silently discarded.

If you have Sendmail 8.12, then locally-submitted messages are sent via
SMTP, and MIMEDefang will be called for each resent message. It is
possible to set up Sendmail 8.12 so locally-submitted messages are
delivered directly; in this case, stream_by_domain will *not* work.

Using stream_by_domain allows you to customize your filter rules for
each domain. If you use the function as described above, you can do this
in your filter routine:

    	sub filter {
    		my($entity, $fname, $ext, $type) = @_;
    		if ($Domain eq "abc.com") {
    			# Filter actions for abc.com
    		} elsif ($Domain eq "xyz.com") {
    			# Filter actions for xyz.com
    		} else {
    			# Default filter actions
    		}
    	}

You cannot rely on \$Domain being set unless you have called
stream_by_domain().

**stream_by_recipient()**

:   *Do not use this function unless you have Sendmail 8.12 and
    locally-* submitted e-mail is submitted using SMTP.

This function should *only* be called at the very beginning of
filter_begin(), like this:

    	sub filter_begin {
    		if (stream_by_recipient()) {
    			return;
    		}
    		# Rest of filter_begin
    	}

If there is more than one recipient, stream_by_recipient() resends the
message once to each recipient. That way, you can customize your filter
rules on a per-recipient basis. This may increase the load on your mail
server considerably.

Also, a \"recipient\" is determined before alias expansion. So
\"all\@mydomain.com\" is considered a single recipient, even if Sendmail
delivers to a list.

If you have Sendmail 8.12, then locally-submitted messages are sent via
SMTP, and MIMEDefang will be called for each resent message. It is
possible to set up Sendmail 8.12 so locally-submitted messages are
delivered directly; in this case, stream_by_recipient() will *not* work.

stream_by_recipient() allows you to customize your filter rules for each
recipient in a manner similar to stream_by_domain().

# LOGGING

**md_graphdefang_log_enable(\$facility, \$enum_recips)**

:   Enables the md_graphdefang_log function (described next). The
    function logs to syslog using the specified facility. If you omit
    \$facility, it defaults to \'mail\'. If you do not call
    md_graphdefang_log_enable in your filter, then any calls to
    md_graphdefang_log simply do nothing.

If you supply \$enum_recips as 1, then a line of logging is output for
*each* recipient of a mail message. If it is zero, then only a single
line is output for each message. If you omit \$enum_recips, it defaults
to 1.

**md_graphdefang_log(\$event, \$v1, \$v2)**

:   Logs an event with up to two optional additional parameters. The log
    message has a specific format useful for graphing tools; the message
    looks like this:

```{=html}
<!-- -->
```
    	MDLOG,msgid,event,v1,v2,sender,recipient,subj

\"MDLOG\" is literal text. \"msgid\" is the Sendmail queue identifier.
\"event\" is the event name, and \"v1\" and \"v2\" are the additional
parameters. \"sender\" is the sender\'s e-mail address. \"recipient\" is
the recipient\'s e-mail address, and \"subj\" is the message subject. If
a message has more than one recipient, md_graphdefang_log may log an
event message for *each* recipient, depending on how you called
md_graphdefang_log_enable.

Note that md_graphdefang_log should not be used in filter_relay,
filter_sender or filter_recipient. The global variables it relies on are
not valid in that context.

If you want to log general text strings, *do not* use
md_graphdefang_log. Instead, use md_syslog (described next).

**md_syslog(\$level, \$msg)**

:   Logs the message \$msg to syslog, using level \$level. The level is
    a literal string, and should be one of \'err\', \'debug\',
    \'warning\', \'emerg\', \'crit\', \'notice\' or \'info\'. (See
    syslog(3) for details.)

Note that md_syslog does *not* perform %-subsitutions like syslog(3)
does. Depending on your Perl installation, md_syslog boils down to a
call to Unix::Syslog::syslog or Sys::Syslog::syslog. See the
Unix::Syslog or Sys::Syslog man pages for more details.

**md_openlog(\$tag, \$facility)**

:   Sets the tag used in syslog messages to \$tag, and sends the logs to
    the \$facility facility. If you do not call md_openlog before you
    call md_syslog, then it is called implicitly with \$tag set to
    **mimedefang.pl** and \$facility set to **mail**.

# RBL LOOKUP FUNCTIONS

**mimedefang.pl** includes the following functions for looking up IP
addresses in DNS-based real-time blacklists. Note that the
\"relay_is_blacklisted\" functions are deprecated and may be removed in
a future release. Instead, you should use the module Net::DNSBL::Client
from CPAN.

**relay_is_blacklisted(\$relay, \$domain)**

:   This checks a DNS-based real-time spam blacklist, and returns true
    if the relay host is blacklisted, or false otherwise. (In fact, the
    return value is whatever the blacklist returns as a resolved
    hostname, such as \"127.0.0.4\")

Note that **relay_is_blacklisted** uses the built-in **gethostbyname**
function; this is usually quite inefficient and does not permit you to
set a timeout on the lookup. Instead, we recommend using one of the
other DNS lookup function described in this section. (Note, though, that
the other functions require the Perl Net::DNS module, whereas
**relay_is_blacklisted** does not.)

Here\'s an example of how to use **relay_is_blacklisted**:

    	if (relay_is_blacklisted($RelayAddr, "rbl.spamhaus.org")) {
    		action_add_header("X-Blacklist-Warning",
    			  "Relay $RelayAddr is blacklisted by Spamhaus");
    	}

**relay_is_blacklisted_multi(\$relay, \$timeout, \$answers_wanted, \[\$domain1, \$domain2, \...\], \$res)**

:   This function is similar to **relay_is_blacklisted**, except that it
    takes a timeout argument (specified in seconds) and an array of
    domains to check. The function checks all domains in parallel, and
    is guaranteed to return in **\$timeout** seconds. (Actually, it may
    take up to one second longer.)

The parameters are:

\$relay \-- the IP address you want to look up

\$timeout \-- a timeout in seconds after which the function should
return

\$answers_wanted \-- the maximum number of positive answers you care
about. For example, if you\'re looking up an address in 10 different
RBLs, but are going to bounce it if it is on four or more, you can set
\$answers_wanted to 4, and the function returns as soon as four \"hits\"
are discovered. If you set \$answers_wanted to zero, then the function
does not return early.

\[\$domain1, \$domain2, \...\] \-- a reference to an array of strings,
where each string is an RBL domain.

\$res \-- a Net::DNS::Resolver object. This argument is optional; if you
do not supply it, then **relay_is_blacklisted_multi** constructs its own
resolver.

The return value is a reference to a hash; the keys of the hash are the
original domains, and the corresponding values are either SERVFAIL,
NXDOMAIN, or a list of IP addresses in dotted-quad notation.

Here\'s an example:

        $ans = relay_is_blacklisted_multi($RelayAddr, 8, 0,
            ["sbl.spamhaus.org", "relays.ordb.org"]);

        foreach $domain (keys(%$ans)) {
            $r = $ans->{$domain};
            if (ref($r) eq "ARRAY") {
                # It's an array -- it IS listed in RBL
                print STDERR "Lookup in $domain yields [ ";
                foreach $addr (@$r) {
                    print STDERR $addr . " ";
                }
                print STDERR "]\n";
            } else {
                # It is NOT listed in RBL
                print STDERR "Lookup in $domain yields "
                             . $ans->{$domain} . "\n";
            }
        }

You should compare each of \$ans-\>{\$domain} to \"SERVFAIL\" and
\"NXDOMAIN\" to see if the relay is *not* listed. Any other return value
will be an array of IP addresses indicating that the relay is listed.

Any lookup that does not succeed within \$timeout seconds has the
corresponding return value set to SERVFAIL.

**relay_is_blacklisted_multi_list(\$relay, \$timeout, \$answers_wanted, \[\$domain1, \$domain2, \...\], \$res)**

:   This function is similar to **relay_is_blacklisted_multi** except
    that the return value is simply an array of RBL domains in which the
    relay was listed.

**relay_is_blacklisted_multi_count(\$relay, \$timeout, \$answers_wanted, \[\$domain1, \$domain2, \...\], \$res)**

:   This function is similar to **relay_is_blacklisted_multi** except
    that the return value is an integer specifying the number of domains
    on which the relay was blacklisted.

**md_get_bogus_mx_hosts(\$domain)**

:   This function looks up all the MX records for the specified domain
    (or A records if there are no MX records) and returns a list of
    \"bogus\" IP addresses found amongst the records. A \"bogus\" IP
    address is an IP address in a private network (10.0.0.0/8,
    172.16.0.0/12, 192.168.0.0/16), the loopback network (127.0.0.0/8),
    local-link for auto-DHCP (169.254.0.0/16), IPv4 multicast
    (224.0.0.0/4) or reserved (240.0.0.0/4).

Here\'s how you might use the function in filter_sender:

    sub filter_sender {
        my ($sender, $ip, $hostname, $helo) = @_;
        if ($sender =~ /@([^>]+)/) {
            my $domain = $1;
            my @bogushosts = md_get_bogus_mx_hosts($domain);
            if (scalar(@bogushosts)) {
                return('REJECT', "Domain $domain contains bogus MX record(s) " .
                       join(', ', @bogushosts));
            }
        }
        return ('CONTINUE', 'ok');
    }

# TEST FUNCTIONS

**mimedefang.pl** includes some \"test\" functions:

**md_version()**

:   returns the version of MIMEDefang as a string (for example,
    \"3.0\").

**message_rejected()**

:   Returns true if any of **action_tempfail**, **action_bounce** or
    **action_discard** have been called for this message; returns false
    otherwise.

If you have the Mail::SpamAssassin Perl module installed (see
http://www.spamassassin.org) you may call any of the spam_assassin\_\*
functions. They should only be called from **filter_begin** or
**filter_end** because they operate on the entire message at once. Most
functions use an optionally provided config file. If no config file is
provided, mimedefang.pl will look for one of four default SpamAssassin
preference files. The first of the following found will be used:

**o**

:   /etc/mail/sa-mimedefang.cf

**o**

:   /etc/mail/spamassassin/sa-mimedefang.cf

**o**

:   /etc/mail/spamassassin/local.cf

**o**

:   /etc/mail/spamassassin.cf

**Important Note**: MIMEDefang does *not* permit SpamAssassin to modify
messages. If you want to tag spam messages with special headers or alter
the subject line, you must use MIMEDefang functions to do it. Setting
SpamAssassin configuration options to alter messages will not work.

**spam_assassin_is_spam(\[ \$config_file \])**

:   Determine if the current message is SPAM/UCE as determined by
    SpamAssassin. Compares the score of the message against the
    threshold score (see below) and returns true if it is. Uses
    **spam_assassin_check** below.

**spam_assassin_check(\[ \$config_file \])**

:   This function returns a four-element list of the form (\$hits,
    \$required, \$tests, \$report). \$hits is the \"score\" given to the
    message by SpamAssassin (higher score means more likely SPAM).
    \$required is the number of hits required before SpamAssassin
    concludes that the message is SPAM. \$tests is a comma-separated
    list of SpamAssassin test names, and \$report is text detailing
    which tests triggered and their point score. This gives you insight
    into why SpamAssassin concluded that the message is SPAM. Uses
    **spam_assassin_status** below.

**spam_assassin_status(\[ \$config_file \])**

:   This function returns a Mail::SpamAssasin::PerMsgStatus object. Read
    the SpamAssassin documentation for details about this object. You
    are responsible for calling the **finish** method when you are done
    with it. Uses **spam_assassin_init** and **spam_assassin_mail**
    below.

**spam_assassin_init(\[ \$config_file \])**

:   This function returns the new global Mail::SpamAssassin object with
    the specified or default config (outlined above). If the global
    object is already defined, returns it \-- does not change config
    files! The object can be used to perform other SpamAssassin related
    functions.

**spam_assassin_mail()**

:   This function returns a Mail::SpamAssassin::NoMailAudit object with
    the current email message contained in it. It may be used to perform
    other SpamAssassin related functions.

**rspamd_check(\[ \$uri \]) \*experimental\***

:   This function returns a six-element list of the form (\$hits,
    \$required, \$tests, \$report, \$action, \$is_spam). \$hits is the
    \"score\" given to the message by Rspamd (higher score means more
    likely SPAM). \$required is the number of hits required before
    Rspamd concludes that the message is SPAM. \$tests is a list of
    Rspamd test names, and \$report is text detailing which tests
    triggered and their point score. If JSON and LWP modules are present
    \$report will be a json string; \$action is the action that
    rspamd(8) wants to apply and \$is_spam is a boolean value
    (true/false) that determines if the message is spam or not. This
    gives you insight into why Rspamd concluded that the message is
    SPAM.

**md_copy_orig_msg_to_work_dir()**

:   Normally, virus-scanners are passed only the unpacked, decoded parts
    of a MIME message. If you want to pass the original, undecoded
    message in as well, call **md_copy_orig_msg_to_work_dir** *prior to*
    calling **message_contains_virus**.

**md_copy_orig_msg_to_work_dir_as_mbox_file()**

:   Normally, virus-scanners are passed only the unpacked, decoded parts
    of a MIME message. If you want to pass the original, undecoded
    message in as a UNIX-style \"mbox\" file, call
    **md_copy_orig_msg_to_work_dir_as_mbox_file** *prior to* calling
    **message_contains_virus**. The only difference between this
    function and **md_copy_orig_msg_to_work_dir** is that this function
    prepends a \"From\_\" line to make the message look like a
    UNIX-style mbox file. This is required for some virus scanners (such
    as Clam AntiVirus) to recognize the file as an e-mail message.

**message_contains_virus()**

:   This function runs *every* installed virus-scanner and returns the
    scanner results. The function should be called in list context; the
    return value is a three-element list (\$code, \$category, \$action).

\$code is the actual return code from the virus scanner.

\$category is a string categorizing the return code:

\"ok\" - no viruses detected.

\"not-installed\" - indicated virus scanner is not installed.

\"cannot-execute\" - for some reason, the scanner could not be executed.

\"virus\" - a virus was found.

\"suspicious\" - a \"suspicious\" file was found.

\"interrupted\" - scanning was interrupted.

\"swerr\" - an internal scanner software error occurred.

\$action is a string containing the recommended action:

\"ok\" - allow the message through unmolested.

\"quarantine\" - a virus was detected; quarantine it.

\"tempfail\" - something went wrong; tempfail the message.

**message_contains_virus_trend()**

:   

**message_contains_virus_nai()**

:   

**message_contains_virus_bdc()**

:   

**message_contains_virus_nvcc()**

:   

**message_contains_virus_csav()**

:   

**message_contains_virus_fsav()**

:   

**message_contains_virus_hbedv()**

:   

**message_contains_virus_vexira()**

:   

**message_contains_virus_sophos()**

:   

**message_contains_virus_clamav()**

:   

**message_contains_virus_clamdscan()**

:   

**message_contains_virus_avp()**

:   

**message_contains_virus_avp5()**

:   

**message_contains_virus_fprot()**

:   

**message_contains_virus_fpscan()**

:   

**message_contains_virus_fprotd()**

:   

**message_contains_virus_fprotd_v6()**

:   

**message_contains_virus_nod32()**

:   These functions should be called in **list context**. They use the
    indicated anti-virus software to scan the message for viruses. These
    functions are intended for use in filter_begin() to make an initial
    scan of the e-mail message.

The supported virus scanners are:

**nai**

:   NAI \"uvscan\" - http://www.nai.com/

Bitdefender \"bdc\" - http://www.bitdefender.com/

**csav**

:   Command Anti-Virus - http://www.commandsoftware.com/

**fsav**

:   F-Secure Anti-Virus - http://www.f-secure.com/

**hbedv**

:   H+BEDV \"AntiVir\" - http://www.hbedv.com/

**vexira**

:   Vexira \"Vexira\" - http://www.centralcommand.com/

**sophos**

:   Sophos AntiVirus - http://www.sophos.com/

**avp**

:   Kaspersky AVP and aveclient (AVP5) - http://www.avp.ru/

**clamav**

:   Clam AntiVirus - http://www.clamav.net/

**f-prot**

:   F-RISK F-PROT - http://www.f-prot.com/

**nod32cli**

:   ESET NOD32 - http://www.eset.com/

**message_contains_virus_carrier_scan(\[\$host\])**

:   Connects to the specified host:port:local_or_nonlocal (default
    **\$CSSHost**), where the Symantec CarrierScan Server daemon is
    expected to be listening. Return values are the same as the other
    message_contains_virus functions.

**message_contains_virus_sophie(\[\$sophie_sock\])**

:   Connects to the specified socket (default **\$SophieSock**), where
    the Sophie daemon is expected to be listening. Return values are the
    same as the other message_contains_virus functions.

**message_contains_virus_clamd(\[\$clamd_sock\])**

:   Connects to the specified socket (default **\$ClamdSock**), where
    the clamd daemon is expected to be listening. Return values are the
    same as the other message_contains_virus functions.

**message_contains_virus_trophie(\[\$trophie_sock\])**

:   Connects to the specified socket (default **\$TrophieSock**), where
    the Trophie daemon is expected to be listening. Return values are
    the same as the other message_contains_virus functions.

**entity_contains_virus(\$entity)**

:   This function runs the specified MIME::Entity through *every*
    installed virus-scanner and returns the scanner results. The return
    values are the same as for **message_contains_virus()**.

**entity_contains_virus_trend(\$entity)**

:   

**entity_contains_virus_nai(\$entity)**

:   

**entity_contains_virus_bdc(\$entity)**

:   

**entity_contains_virus_nvcc(\$entity)**

:   

**entity_contains_virus_csav(\$entity)**

:   

**entity_contains_virus_fsav(\$entity)**

:   

**entity_contains_virus_hbedv(\$entity)**

:   

**entity_contains_virus_sophos(\$entity)**

:   

**entity_contains_virus_clamav(\$entity)**

:   

**entity_contains_virus_clamdscan(\$entity)**

:   

**entity_contains_virus_avp(\$entity)**

:   

**entity_contains_virus_avp5(\$entity)**

:   

**entity_contains_virus_fprot(\$entity)**

:   

**entity_contains_virus_fpscan(\$entity)**

:   

**entity_contains_virus_fprotd(\$entity)**

:   

**entity_contains_virus_fprotd_v6(\$entity)**

:   

**entity_contains_virus_nod32(\$entity)**

:   These functions, meant to be called from filter(), are similar to
    the message_contains_virus functions except they scan only the
    current part. They should be called from list context, and their
    return values are as described for the message_contains_virus
    functions.

**entity_contains_virus_carrier_scan(\$entity\[, \$host\])**

:   Connects to the specified host:port:local_or_nonlocal (default
    **\$CSSHost**), where the Symantec CarrierScan Server daemon is
    expected to be listening. Return values are the same as the other
    entity_contains_virus functions.

**entity_contains_virus_sophie(\$entity\[, \$sophie_sock\])**

:   Connects to the specified socket (default **\$SophieSock**), where
    the Sophie daemon is expected to be listening. Return values are the
    same as the other entity_contains_virus functions.

**entity_contains_virus_trophie(\$entity\[, \$trophie_sock\])**

:   Connects to the specified socket (default **\$TrophieSock**), where
    the Trophie daemon is expected to be listening. Return values are
    the same as the other entity_contains_virus functions.

**entity_contains_virus_clamd(\$entity\[, \$clamd_sock\])**

:   Connects to the specified socket (default **\$ClamdSock**), where
    the clamd daemon is expected to be listening. Return values are the
    same as the other entity_contains_virus functions.

# SMTP FLOW

This section illustrates the flow of messages through MIMEDefang.

**1. INITIAL CONNECTION**

:   If you invoked **mimedefang** with the **-r** option and have
    defined a filter_relay routine, it is called.

**2. SMTP HELO COMMAND**

:   The HELO string is stored internally, but no filter functions are
    called.

**3. SMTP MAIL FROM: COMMAND**

:   If you invoked **mimedefang** with the **-s** option and have
    defined a filter_sender routine, it is called.

**4. SMTP RCPT TO: COMMAND**

:   If you invoked **mimedefang** with the **-t** option and have
    defined a filter_recipient routine, it is called.

**5. END OF SMTP DATA**

:   filter_begin is called. For each MIME part, filter is called. Then
    filter_end is called.

# PRESERVING RELAY INFORMATION

Most organizations have more than one machine handling internet e-mail.
If the primary machine is down, mail is routed to a secondary (or
tertiary, etc.) MX server, which stores the mail until the primary MX
host comes back up. Mail is then relayed to the primary MX host.

Relaying from a secondary to a primary MX host has the unfortunate side
effect of losing the original relay\'s IP address information.
MIMEDefang allows you to preserve this information. One way around the
problem is to run MIMEDefang on all the secondary MX hosts and use the
same filter. However, you may not have control over the secondary MX
hosts. If you can persuade the owners of the secondary MX hosts to run
MIMEDefang with a simple filter that only preserves relay information
and does no other scanning, your primary MX host can obtain relay
information and make decisions using \$RelayAddr and \$RelayHostname.

When you configure MIMEDefang, supply the \"\--with-ipheader\" argument
to the ./configure script. When you install MIMEDefang, a file called
**/etc/mail/mimedefang-ip-key** will be created which contains a
randomly-generated header name. Copy this file to all of your mail
relays. It is important that all of your MX hosts have the **same** key.
The key should be kept confidential, but it\'s not disastrous if it
leaks out.

On your secondary MX hosts, add this line to filter_end:

    	add_ip_validation_header();

*Note*: You should *only* add the validation header to mail destined for
one of your other MX hosts! Otherwise, the validation header will leak
out.

When the secondary MX hosts relay to the primary MX host, \$RelayAddr
and \$RelayHostname will be set based on the IP validation header. If
MIMEDefang notices this header, it sets the global variable \$WasResent
to 1. Since you don\'t want to trust the header unless it was set by one
of your secondary MX hosts, you should put this code in filter_begin:

    	if ($WasResent) {
    		if ($RealRelayAddr ne "ip.of.secondary.mx" and
    		    $RealRelayAddr ne "ip.of.tertiary.mx") {
    			$RelayAddr = $RealRelayAddr;
    			$RelayHostname = $RealRelayHostname;
    		}
    	}

This resets the relay address and hostname to the actual relay address
and hostname, unless the message is coming from one of your other MX
hosts.

On the primary MX host, you should add this in filter_begin:

    	delete_ip_validation_header();

This prevents the validation header from leaking out to recipients.

*Note*: The IP validation header works only in message-oriented
functions. It (obviously) has no effect on **filter_relay**,
**filter_sender** and **filter_recipient**, because no header
information is available yet. You must take this into account when
writing your filter; you must defer relay-based decisions to the message
filter for mail arriving from your other MX hosts.

# GLOBAL VARIABLE LIFETIME

The following list describes the lifetime of global variables (thanks to
Tony Nugent for providing this documentation.)

If you set a global variable:

**Outside a subroutine in your filter file**

:   It is available to all functions, all the time.

**In filter_relay, filter_sender or filter_recipient**

:   Not guaranteed to be available to any other function, not even from
    one filter_recipient call to the next, when receiving a
    multi-recipient email message.

**In filter_begin**

:   Available to filter_begin, filter and filter_end

**In filter**

:   Available to filter and filter_end

**In filter_end**

:   Available within filter_end

The \"built-in\" globals like \$Subject, \$Sender, etc. are always
available to filter_begin, filter and filter_end. Some are available to
filter_relay, filter_sender or filter_recipient, but you should check
the documentation of the variable above for details.

# MAINTAINING STATE

There are four basic groups of filtering functions:

**1**

:   filter_relay

**2**

:   filter_sender

**3**

:   filter_recipient

**4**

:   filter_begin, filter, filter_multipart, filter_end

In general, for a given mail message, these groups of functions may be
called in completely different Perl processes. Thus, there is *no way*
to maintain state inside Perl between groups of functions. That is, you
cannot set a variable in **filter_relay** and expect it to be available
in **filter_sender**, because the **filter_sender** invocation might
take place in a completely different process.

For a given mail message, it *is* always the case that **filter_begin**,
**filter**, **filter_multipart** and **filter_end** are called in the
same Perl process. Therefore, you can use global variables to carry
state among those functions. You should be very careful to initialize
such variables in **filter_begin** to ensure no data leaks from one
message to another.

Also for a given mail message, the \$CWD global variable holds the
message spool directory, and the current working directory is set to
\$CWD. Therefore, you can store state in files inside \$CWD. If
**filter_sender** stores data in a file inside \$CWD, then
**filter_recipient** can retrieve that data.

Since **filter_relay** is called directly after a mail connection is
established, there is no message context yet, no per-message mimedefang
spool directory, and the \$CWD global is not set. Therefore, it is not
possible to share information from **filter_relay** to one of the other
filter functions. The only thing that **filter_relay** has in common
with the other functions are the values in the globals \$RelayAddr, and
\$RelayHostname. These could be used to access per-remote-host
information in some database.

Inside \$CWD, we reserve filenames beginning with upper-case letters for
internal MIMEDefang use. If you want to create files to store state,
name them beginning with a lower-case letter to avoid clashes with
future releases of MIMEDefang.

# SOCKET MAPS

If you have Sendmail 8.13 or later, and have compiled it with the
SOCKETMAP option, then you can use a special map type that communicates
over a socket with another program (rather than looking up a key in a
Berkeley database, for example.)

**mimedefang-multiplexor** implements the Sendmail SOCKETMAP protocol if
you supply the **-N** option. In that case, you can define a function
called **filter_map** to implement map lookups. **filter_map** takes two
arguments: \$mapname is the name of the Sendmail map (as given in the K
sendmail configuration directive), and \$key is the key to be looked up.

**filter_map** must return a two-element list: (\$code, \$val) \$code
can be one of:

**OK**

:   The lookup was successful. In this case, \$val must be the result of
    the lookup

**NOTFOUND**

:   The lookup was unsuccessful \-- the key was not found. In this case,
    \$val should be the empty string.

**TEMP**

:   There was a temporary failure of some kind. \$val can be an
    explanatory error message.

**TIMEOUT**

:   There was a timeout of some kind. \$val can be an explanatory error
    message.

**PERM**

:   There was a permanent failure. This is *not* the same as an
    unsuccessful lookup; it should be used only to indicate a serious
    misconfiguration. As before, \$val can be an explanatory error
    message.

Consider this small example. Here is a minimal Sendmail configuration
file:

    	V10/Berkeley
    	Kmysock socket unix:/var/spool/MIMEDefang/map.sock
    	kothersock socket unix:/var/spool/MIMEDefang/map.sock

If **mimedefang-multiplexor** is invoked with the arguments **-N
unix:/var/spool/MIMEDefang/map.sock**, and the filter defines
**filter_map** as follows:

    	sub filter_map ($$) {
    	    my($mapname, $key) = @_;
    	    my $ans;
    	    if($mapname ne "mysock") {
    	        return("PERM", "Unknown map $mapname");
    	    }
    	    $ans = reverse($key);
    	    return ("OK", $ans);
    	}

Then in Sendmail\'s testing mode, we see the following:

    	> /map mysock testing123
    	map_lookup: mysock (testing123) returns 321gnitset (0)
    	> /map othersock foo
    	map_lookup: othersock (foo) no match (69)

(The return code of 69 means EX_UNAVAILABLE or Service Unavailable)

A real-world example could do map lookups in an LDAP directory or SQL
database, or perform other kinds of processing. You can even implement
standard Sendmail maps like virtusertable, mailertable, access_db, etc.
using SOCKETMAP.

# TICK REQUESTS

If you supply the **-X** option to **mimedefang-multiplexor**, then
every so often, a \"tick\" request is sent to a free worker. If your
filter defines a function called **filter_tick**, then this function is
called with a single argument: the tick type. If you run multiple
parallel ticks, then each tick has a type ranging from 0 to *n*-1, where
*n* is the number of parallel ticks. If you\'re only running one tick
request, then the argument to **filter_tick** is always 0.

You can use this facility to run periodic tasks from within MIMEDefang.
Note, however, that you have no control over which worker is picked to
run **filter_tick**. Also, at most one **filter_tick** call with a
particular \"type\" argument will be active at any time, and if there
are no free workers when a tick would occur, the tick is skipped.

# SUPPORTED VIRUS SCANNERS

The following virus scanners are supported by MIMEDefang:

**o**

:   Symantec CarrierScan Server
    (http://www.symantec.com/region/can/eng/product/scs/)

**o**

:   Trend Micro vscan (http://www.antivirus.com/)

**o**

:   Sophos Sweep (http://www.sophos.com/products/antivirus/savunix.html)

**o**

:   H+BEDV AntiVir (http://www.hbedv.com/)

**o**

:   Central Command Vexira (http://www.centralcommand.com/)

**o**

:   NAI uvscan (http://www.nai.com)

**o**

:   Bitdefender bdc (http://www.bitdefender.com)

**o**

:   Norman Virus Control (NVCC) (http://www.norman.no/)

**o**

:   Command csav (http://www.commandsoftware.com)

**o**

:   F-Secure fsav (http://www.f-secure.com)

**o**

:   The clamscan and clamdscan command-line scanners and the clamd
    daemon from Clam AntiVirus (http://www.clamav.net/)

**o**

:   Kaspersky Anti-Virus (AVP) (http://www.kaspersky.com/)

**o**

:   F-Risk F-Prot (http://www.f-prot.com/)

**o**

:   F-Risk F-Prot v6 (http://www.f-prot.com/)

**o**

:   F-Risk FPROTD (daemonized version of F-Prot)

**o**

:   Symantec CarrierScan Server
    (http://www.symantec.ca/region/can/eng/product/scs/buymenu.html)

**o**

:   Sophie (http://www.vanja.com/tools/sophie/), which uses the libsavi
    library from Sophos, is supported in daemon-scanning mode.

**o**

:   Trophie (http://www.vanja.com/tools/trophie/), which uses the
    libvsapi library from Trend Micro, is supported in daemon-scanning
    mode.

**o**

:   ESET NOD32 (http://www.eset.com/)

# AUTHORS

**mimedefang** was written by Dianne Skoll \<dfs\@roaringpenguin.com>.
The **mimedefang** home page is *http://www.mimedefang.org/*.

# SEE ALSO

mimedefang(8), mimedefang.pl(8), Mail::MIMEDefang(3)
