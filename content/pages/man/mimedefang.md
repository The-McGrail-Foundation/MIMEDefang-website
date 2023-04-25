Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_mimedefang
Status: published
Template: documentation


# NAME

mimedefang - Sendmail MIME mail filter

# SYNOPSIS

**mimedefang prcap**

**mimedefang -p *connection* -m *mx_socket_name* -U *user*
\[*options*\]**

# DESCRIPTION

**mimedefang** is a filter built around Sendmail 8.11\'s *milter* API
for mail filters. It collects each incoming message and runs a filter on
the message. This is useful for deleting attachments which may be a
security risk on poorly-designed systems like Microsoft Windows.

**mimedefang** does not actually run the Perl filter; instead, it
communicates with **mimedefang-multiplexor**(8), which manages a pool of
persistent Perl processes. See the **mimedefang-multiplexor** man page
for additional information.

# OPTIONS

If you invoke **mimedefang** with the single argument **prcap**, it
prints information about the version of Milter it is linked against and
exits. Otherwise, you should invoke **mimedefang** as shown in the
second line of the SYNOPSIS.

**-U *user***

:   Runs **mimedefang** as *user* rather than *root*. The *user*
    argument must match the argument to **mimedefang-multiplexor**\'s
    **-U** option as well.

**-y**

:   If the **-y** command-line option is given, MIMEDefang will call
    smfi_setsymlist to set the list of macros it wants. *This function*
    leaked memory in versions of Sendmail prior to 8.14.4 so by default
    we do not call it. If you are running an older version of sendmail,
    you should explicitly set the list of macros you want in the
    Sendmail configuration file.

**-z *spooldir***

:   Set the spool directory to *spooldir*. If this option is omitted,
    the spool directory defaults to /var/spool/MIMEDefang.

**-p *connection***

:   The **-p** switch is required and specifies the *milter* connection
    type. Typically, you should run **mimedefang** on the same computer
    as **sendmail**. Therefore, you should use a UNIX-domain socket for
    the connection type. The suggested value for the **-p** switch is
    **mimedefang.sock** under the spool directory.

**-m *mx_socket_name***

:   Specifies the socket for communicating with
    **mimedefang-multiplexor**(8). The *mx_socket_name* specifies the
    path of the UNIX-domain socket. See **mimedefang-multiplexor**(8)
    for details.

**-b *backlog***

:   Sets the \"backlog\" argument to the **listen**(2) system call to
    *backlog*. If this option is omitted, then the operating-system
    default backlog is used.

**-G**

:   Normally, **mimedefang** uses a umask of 077 when creating the
    milter socket and files. If you would like the socket to be readable
    and writeable by the group and files to be group-readable, supply
    the **-G** option. This causes the umask to be 007 whenever
    UNIX-domain sockets are created and 027 whenever files are created.
    *Note*: if your milter library is too old to have the
    smfi_opensocket() function, the **-G** option causes **mimedefang**
    to use a umask of 007 throughout its execution.

Note that by default, /var/spool/MIMEDefang is created with mode 0700.
If you use the **-G** option, you probably should change the mode to
0750.

**-d**

:   The **-d** switch causes **mimedefang** *not* to delete the
    temporary spool files it creates for incoming messages. This is for
    debugging purposes only and should *never* be used on a production
    mail server.

**-r**

:   Causes **mimedefang** to perform a relay check before processing any
    messages. It calls into a user-supplied Perl function called
    **filter_relay** with the IP address and host name of the sending
    relay. (See **mimedefang-filter**(5) for details.)

**-H**

:   Causes **mimedefang** to perform a HELO check before processing any
    messages. It calls into a user-supplied Perl function called
    **filter_helo** with the IP address and host name of the sending
    relay, and the HELO argument. (See **mimedefang-filter**(5) for
    details.)

**-s**

:   Causes **mimedefang** to perform a sender check before processing
    the message body. It calls into a user-supplied Perl function called
    **filter_sender** with the envelope address of the sender. (See
    **mimedefang-filter**(5) for details.)

**-t**

:   Causes **mimedefang** to perform recipient checks before processing
    the message body. It calls into a user-supplied Perl function called
    **filter_recipient** with the envelope address of each recipient.
    (See **mimedefang-filter**(5) for details.)

**-q**

:   Permits the multiplexor to queue new connections. See the section
    QUEUEING REQUESTS in the mimedefang-multiplexor man page. Note that
    this option and the **-R** option are mutually-exclusive. If you
    supply **-q**, then **-R** is ignored.

**-k**

:   Causes **mimedefang** *not* to delete working directories if a
    filter fails. This lets you obtain the message which caused the
    filter to fail and determine what went wrong. **mimedefang** logs
    the directory containing the failed message using syslog.

**-P *fileName***

:   Causes **mimedefang** to write its process-ID (after becoming a
    daemon) to the specified file. The file will be owned by root.

**-o *fileName***

:   Causes **mimedefang** to use *fileName* as a lock file to avoid
    multiple instances from running. If you supply **-P** but not
    **-o**, then **mimedefang** constructs a lock file by appending
    \".lock\" to the pid file. However, this is less secure than having
    a root-owned pid file in a root-owned directory and a lock file
    writable by the user named by the **-U** option. (The lock file must
    be writable by the **-U** user.)

**-R *num***

:   Normally, **mimedefang** tempfails a new SMTP connection if there
    are no free workers. Supplying the **-R** *num* option makes
    **mimedefang** tempfail new connections if there are fewer than
    *num* free workers, *unless* the connection is from the local host.
    This allows you to favour connections from localhost so your
    clientmqueue doesn\'t build up. Note that supplying **-R 0** is
    subtly different from omitting the option; in this case,
    **mimedefang** permits new connections from localhost to queue, but
    not connections from other hosts (unless you also supply the **-q**
    option.)

The purpose of the **-R** option is to reserve resources for
clientmqueue runs. Otherwise, on a very busy mail server, clientmqueue
runs can starve for a long time, leading to delays for locally-generated
or streamed mail. We recommend using a small number for *num*; probably
no more than 3 or 10% of the total number of workers (whichever is
smaller.)

Note that this option and the **-q** option are mutually-exclusive. If
you supply **-q**, then **-R** is ignored.

**-C**

:   Conserve file descriptors by opening and closing disk files more
    often. (Disk files are never held open across Milter callbacks.)
    While this shortens the length of time a file descriptor is open, it
    also leaves more opportunities for the open to fail. We do not
    recommend the use of this flag except on very busy systems that
    exhibit failures due to a shortage of file descriptors.

**-T**

:   Causes **mimedefang** to log the run-time of the Perl filter using
    syslog.

**-x *string***

:   Add *string* as the content of the X-Scanned-By: header. If you set
    *string* to the empty string (i.e. -x \"\"), then no X-Scanned-By:
    header will be added.

**-X**

:   Do not add an X-Scanned-By: header. Specifying -X is equivalent to
    specifying -x \"\".

**-D**

:   Do not fork into the background and become a daemon. Instead, stay
    in the foreground. Useful mainly for debugging or if you have a
    supervisory process managing **mimedefang**.

**-M**

:   This option is obsolete; it is accepted for backward-compatibility,
    but is ignored.

**-N**

:   Normally, **mimedefang** sees all envelope recipients, even ones
    that Sendmail knows to be invalid. If you don\'t want Sendmail to
    perform a milter callback for recipients it knows to be invalid,
    invoke **mimedefang** with the -N flag. *Please note that this* flag
    only works with Sendmail and Milter 8.14.0 and newer. It has no
    effect if you\'re running an older version of Sendmail or Milter.

-S *facility*

:   Specifies the syslog facility for log messages. The default is
    *mail*. See **openlog**(3) for a list of valid facilities. You can
    use either the short name (\"mail\") or long name (\"LOG_MAIL\") for
    the facility name.

-a *macro*

:   Pass the value of the specified Sendmail macro through to the Perl
    filter. You can repeat the -a option to write more macros than the
    built-in defaults. Note that in addition to asking **mimedefang** to
    pass the macro value to the filter, you must configure Sendmail to
    pass the macro through to **mimedefang** using the
    confMILTER_MACROS_ENVFROM definition in Sendmail\'s m4 configuration
    file.

**-c**

:   Strip \"bare\" carriage-returns (CR) characters from the message
    body. A bare CR should never appear in an e-mail message. Older
    versions of **mimedefang** used to strip them out automatically, but
    now they are left in by default. The **-c** option enables the older
    behavior.

**-h**

:   Print usage information and exit.

# OPERATION

When **mimedefang** starts, it connects to **sendmail** using the
*milter* API. (See the Sendmail 8.11 documentation.) For each incoming
message, **mimedefang** creates a temporary directory and saves
information in the directory. At various phases during the SMTP
conversation, **mimedefang** communicates with
**mimedefang-multiplexor** to perform various operations.
**mimedefang-multiplexor** manages a pool of persistent Perl processes
that actually perform the mail scanning operations.

When a Perl process scans an e-mail, the temporary spool directory
contains certain files; details of the communication protocol between
**mimedefang** and the Perl script are in **mimedefang-protocol**(7).

# WARNINGS

**mimedefang** does violence to the flow of e-mail. The Perl filter is
quite picky and assumes that MIME e-mail messages are well-formed. While
I have tried to make the script safe, I take *no responsibility* for
lost or mangled e-mail messages or any security holes this script may
introduce.

# AUTHOR

**mimedefang** was written by Dianne Skoll \<dfs\@roaringpenguin.com>.
The **mimedefang** home page is *https://www.mimedefang.org/*.

# SEE ALSO

mimedefang.pl(8), mimedefang-filter(5), mimedefang-multiplexor(8),
mimedefang-protocol(7), mimedefang-release(8)
