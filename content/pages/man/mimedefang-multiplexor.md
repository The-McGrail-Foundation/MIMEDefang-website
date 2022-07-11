Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_mimedefang-multiplexor
Status: published
Template: documentation


# NAME

mimedefang-multiplexor - Process pool controller for mail filters.

# SYNOPSIS

**mimedefang-multiplexor \[*options*\]**

# DESCRIPTION

**mimedefang-multiplexor** manages a pool of Perl processes for scanning
e-mail. It is designed to work in conjunction with **mimedefang**(8) and
**mimedefang.pl**(8).

**mimedefang-multiplexor** opens a UNIX-domain socket and listens for
requests for work from **mimedefang**. As requests come in,
**mimedefang-multiplexor** creates Perl processes as needed to scan
mail. The Perl processes are not killed when scanning is completed, but
continue to run in a loop. Perl processes are re-used for subsequent
e-mail messages. This eliminates the large overhead of starting a new
Perl process for each incoming message.

To avoid memory leaks, the Perl processes are killed after they have
handled some number of scans.

# OPTIONS

**-U *user***

:   Runs the multiplexor as *user* rather than *root*. This option is
    mandatory, and must match the **-U** option supplied to
    **mimedefang**.

**-m *minWorkers***

:   The minimum number of Perl processes to keep running at all times.
    The default is zero.

**-x *maxWorkers***

:   The maximum number of Perl processes to run simultaneously. If a
    request comes in and all processes are busy, a temporary failure is
    signalled to the SMTP peer. The default is 2.

**-r *maxRequests***

:   The maximum number of requests a given process handles before it is
    killed and a replacement started. The default is 500.

**-i *idleTime***

:   The idle time in seconds after which to kill of excess Perl
    processes. That is, if the process is idle for longer than this
    time, and there are more than *minWorkers* running, the process is
    killed. Note that this is implemented as a timer which ticks every
    *idleTime* seconds; therefore, processes may be idle for up to twice
    this time before they are killed. The default for *idleTime* is 300
    seconds.

**-V *maxLifetime***

:   The maximum lifetime in seconds of a worker before it is killed and
    a replacement started. The default is -1, which signifies no maximum
    lifetime. Note that the lifetime check is done only when a worker
    becomes idle after a request, or every time the idle-timeout check
    is made. On a very quiet system, workers may live for longer than
    *maxLifetime* by as much as *idleTime*. Note also that the lifetime
    is measured not from when the worker started running, but from when
    it was assigned its very first request. A completely-idle worker
    that has never processed any requests will not be terminated by the
    *maxLifetime* setting.

**-b *busyTime***

:   The longest a Perl process is allowed to spend scanning an e-mail
    before it is declared hung up and killed. The default is 120
    seconds.

**-Z**

:   This option specifies that the multiplexor should accept and process
    \"status updates\" from busy workers. Note that this consumes one
    extra file descriptor per worker, plus a small amount of CPU time
    per status update.

**-c *cmdTime***

:   The timeout for communication between **mimedefang-multiplexor** and
    **mimedefang**, or between **mimedefang-multiplexor** and a Perl
    scanning process. The default is 10 seconds. This timeout should be
    kept quite short.

**-w *waitTime***

:   When **mimedefang-multiplexor** starts the initial workers, or needs
    to bring the number of running workers up to the number defined by
    the **-m** option, it does not start all the workers at once,
    because this could overload your server. Instead, it starts one
    worker every *waitTime* seconds. The default value for *waitTime*
    is 3.

**-W *waitTime***

:   If you use this option, **mimedefang-multiplexor** will *never*
    activate a worker until *waitTime* seconds have elapsed since the
    last worker activation. This could result in mail being tempfailed
    if worker activations do not keep pace with incoming mail. However,
    it may be preferable to tempfail mail rather than allow the load on
    your server to spike up too quickly. The default value for this
    option is 0, meaning that **mimedefang-multiplexor** will start
    workers as quickly as necessary to keep up with incoming mail.

**-z *spooldir***

:   Set the spool directory to *spooldir*. If this option is omitted,
    the spool directory defaults to /var/spool/MIMEDefang.

**-s *pathName***

:   The UNIX-domain socket on which **mimedefang-multiplexor** listens
    for requests. This should be specified as an absolute pathname. If
    this option is not supplied, it defaults to
    mimedefang-multiplexor.sock under the spool directory.

**-a *socket***

:   A socket for listening for requests. This is similar to the **-s**
    socket, except that a restricted set of requests are processed. On
    this socket, the multiplexor will only process requests asking for
    status; it will not accept any commands to do scanning or that would
    consume a worker. See the SOCKET SPECIFICATION section for the
    format of *socket*.

**-p *fileName***

:   Causes **mimedefang-multiplexor** to write its process-ID (after
    becoming a daemon) to the specified file. The file will be owned by
    root.

**-o *fileName***

:   Causes **mimedefang-multiplexor** to use *fileName* as a lock file
    to avoid multiple instances from running. If you supply **-p** but
    not **-o**, then **mimedefang-multiplexor** constructs a lock file
    by appending \".lock\" to the pid file. However, this is less secure
    than having a root-owned pid file in a root-owned directory and a
    lock file writable by the user named by the **-U** option. (The lock
    file must be writable by the **-U** user.)

**-f *filter_path***

:   Normally, **mimedefang-multiplexor** executes a Perl filter script
    called **mimedefang.pl** to scan the e-mail. However, you can have
    it execute any program you like by specifying the full path to the
    program with the **-f** option. This program must obey the protocol
    documented in **mimedefang-protocol**(7); see that manual page for
    details.

Note that the **-f** option does *not* specify the \"filter\" to use
with **mimedefang.pl**; instead, it specifies the program for
**mimedefang-multiplexor** to execute. You almost certainly should *not*
use this option unless you wish to replace **mimedefang.pl** with your
own program.

**-F *rules_path***

:   Specifies the path to the filter rules. By default,
    **/etc/mail/mimedefang-filter** is used. If you use the **-F**
    option, its value is passed to the underlying Perl filter program
    using **-f**.

**-l**

:   Log certain events, including the output of the Perl workers\'
    standard-error, using syslog. Normally, the multiplexor does not log
    much information.

**-d**

:   Write debugging information about event-handling code in
    /var/log/mimedefang-event-debug.log. This is only of use to people
    debugging **mimedefang-multiplexor**.

**-R *kbytes***

:   Limits the resident-set size of the worker filter processes to
    *kbytes* kilobytes. This limit is not supported on all operating
    systems; it is known to work on Linux.

**-M *kbytes***

:   Limits the total memory space of worker filter processes to *kbytes*
    kilobytes. This limit is supported on all operating systems which
    support the setrlimit(2) system call. This should include most
    modern UNIX systems.

We recommend that you monitor your worker filter processes and get a
feel for how much memory they use. You should then limit the memory to
two or three times the worst-case that you have observed. This can help
mitigate denial-of-service attacks which use complicated MIME messages
to force **mimedefang.pl** to consume lots of memory.

**-h**

:   Print usage information and exit.

**-t *filename***

:   Log statistical information to *filename*. See the section
    STATISTICS for more information.

**-T**

:   Log statistical information using **syslog**(2). You may use any
    **-t** and **-T** together, in which case statistical information is
    logged in a file and using **syslog**.

**-u**

:   Flush the statistics file after every write. Normally,
    **mimedefang-multiplexor** does not flush the file; this is the best
    choice for minimizing disk I/O on a busy mail server. However, if
    you wish to watch statistics entries in real-time, you should enable
    flushing.

**-D**

:   Do not fork into the background and become a daemon. Instead, stay
    in the foreground. Useful mainly for debugging or if you have a
    supervisory process managing **mimedefang-multiplexor**.

**-q *queue_size***

:   Normally, if all workers are busy and **mimedefang-multiplexor**
    receives another request, it fails it with the error \"No free
    workers.\" However, if you use the **-q** option, then up to
    *queue_size* requests will be queued. As soon as a worker becomes
    free, the queued requests will be handed off in FIFO order. If the
    queue is full and another request comes in, then the request is
    failed with \"No free workers\".

**-Q *queue_timeout***

:   Queued requests should not stay on the queue indefinitely. If a
    queued request cannot be processed within *queue_timeout*
    (default 30) seconds of being placed on the queue, it is failed with
    a \"Queued request timed out\" message. See the section \"QUEUEING
    REQUESTS\" for more discussion.

**-O *sock***

:   Listen on a *notification socket* for connections from *listeners*.
    **mimedefang-multiplexor** can inform external programs of state
    changes by sending messages over a notification socket. The external
    programs connect to this socket and then listen for notifications.
    See the section SOCKET SPECIFICATION for the format of *sock*.

See the **mimedefang-notify**(7) man page for details of the
notification protocol.

**-N *map_sock***

:   Listen on a *map socket* for Sendmail SOCKETMAP connections. As of
    Sendmail 8.13, you can define a Sendmail map type that talks to a
    daemon over a socket. **mimedefang-multiplexor** implements that
    protocol; consult the **mimedefang-filter**(5) man page for detils
    (see the SOCKET MAPS section).

See the section SOCKET SPECIFICATION for the format of *map_sock*.

**-I *backlog***

:   When **mimedefang-multiplexor** creates a listening socket, it
    calculates the \"backlog\" argument to **listen**(2) based on the
    maximum number of workers. However, you can explicitly set this
    backlog with the **-I** option. Setting the backlog to a high value
    (around 30-50) may help on a very busy server. If you see mail log
    messages saying \"MXCommand: socket: Connection refused\" during
    busy periods, then that\'s an indication you need a higher listen
    backlog.

**-L *interval***

:   Log the worker status every *interval* seconds. This logs a line
    using syslog; the line looks like this:

```{=html}
<!-- -->
```
    Worker status: Stopped=s Idle=i Busy=b Killed=k Queued=q Msgs=m Activations=a

Here, \"Stopped\" is the number of non-running workers, \"Idle\" is the
number of idle workers, \"Busy\" is the number of busy workers,
\"Killed\" is the number of killed workers yet to be reaped, \"Queued\"
is the number of queued requests, \"Msgs\" is the total number of
messages processed since the multiplexor began running, and
\"Activations\" is the number of times a Perl process has been started
since the multiplexor began running.

If you supply an *interval* of 0 (which is the default), no periodic
status logging is performed. If you supply an *interval* of less than 5
seconds, it is silently reset to 5 seconds.

**-S ***facility*

:   Specifies the syslog facility for log messages. The default is
    *mail*. See **openlog**(3) for a list of valid facilities. You can
    use either the short name (\"mail\") or long name (\"LOG_MAIL\") for
    the facility name.

**-E**

:   Specifies that the multiplexor should create an embedded Perl
    interpreter. This can improve performance dramatically. But see the
    section \"EMBEDDING PERL\" for more information.

**-X** *n*

:   Specifies that the multiplexor should initiate a \"tick\" request
    every *n* seconds. This causes your *filter_tick* function (if
    defined) to be called. Note that you have no control over which
    worker executes *filter_tick*. If all workers are busy when a tick
    occurs, that tick request is skipped and a warning message is
    logged.

**-P** *n*

:   Specifies that the multiplexor should run *n* tick requests in
    parallel. Each tick is run as often as specified with the **-X**
    argument. (If you omit the **-P** option, then the multiplexor
    behaves as if **-P 1** had been specified.)

If you run parallel ticks, each tick is assigned an integer identifying
its \"type\". The type ranges from 0 to *n*-1. While there may be as
many as *n* tick requests running at a time, only one tick of each type
will be active at any time.

**-Y** *label*

:   Sets the tag used in the multiplexor\'s syslog messages to *label*
    instead of **mimedefang-multiplexor**.

**-G**

:   Normally, **mimedefang-multiplexor** uses a umask of 027 when
    creating listening sockets. If you would like the sockets to be
    readable and writeable by the group as well as the owner, supply the
    **-G** option. This causes the umask to be 007 whenever UNIX-domain
    sockets are created.

**-y** *n*

:   Limits the maximum number of concurrent **recipok** checks to *n* on
    a per-domain basis. The value of *n* can range from 0 (in which case
    no limit is applied) to *maxWorkers*, where *maxWorkers* is the
    argument to the **-x** option. If *n* is outside that range, it is
    ignored (and no limit is applied.)

    The **recipok** command ultimately invokes the **filter_recipient**
    function in your filter. If you are doing recipient verification
    against servers that may be slow or unreliable, you can use the
    **-y** option to limit the number of concurrent recipient
    verifications per domain. That way, if one domain\'s server becomes
    very slow, it won\'t consume all available workers for recipient
    verification. Instead, its RCPT commands will be tempfailed and
    there will be workers available to handle RCPT commands for other
    domains.

# SOCKET SPECIFICATION

The **-a**, **-N** and **-O** options takes a socket as an argument. The
format of the socket parameter is similar to that of the Sendmail Milter
library, and is one of the following:

**/path/to/socket**

:   A UNIX-domain socket

**inet:portnum**

:   A TCP socket bound to port *portnum*, but which accepts connections
    only from the IPv4 loopback address (127.0.0.1).

**inet_any:portnum**

:   A TCP socket bound to port *portnum* which will accept connections
    from any address. *Use inet_any with caution!*

**inet6:portnum**

:   A TCP socket bound to port *portnum* listening on the IPv6 loopback
    address.

**inet6_any:portnum**

:   A TCP socket bound to port *portnum* listening on the IPv6 wildcard
    address.

# QUEUEING REQUESTS

Normally, if all workers are busy, any additional requests are failed
immediately. However, the **-q** and **-Q** options allow you to queue
requests for a short amount of time. This facility is intended to
gracefully handle a temporary overload; most of the time, your queue
should be empty.

Because **mimedefang** checks the number of free workers when a
connection is opened and fails the connection if there are no free
workers, the intent of the queue is to allow SMTP transactions that are
already underway to continue if there is a slight overload. Any new
connections will be failed if all workers are busy, but existing
connections are allowed to continue. Queuing requests may improve
throughput on extremely busy servers.

Note that if you supply the **-q** option to **mimedefang**, then even
new connections are allowed to queue. This may improve throughput by
keeping the worker utilization higher.

The **-R** option to **mimedefang** can be used to reserve a specified
number of workers for connections from the loopback address. Using the
**-R** option has the side-effect of permitting new connections from the
loopback address to queue.

# EMBEDDING PERL

Normally, when **mimedefang-multiplexor** activates a worker, it forks
and execs **mimedefang.pl**. However, if the multiplexor was compiled
with embedded Perl support, and you supply the **-E** command-line
option, the multiplexor works like this:

1

:   It creates an embedded Perl interpreter, and sources
    **mimedefang.pl** with a special command-line argument telling it to
    read the filter, but not to enter the main loop.

2

:   Each time a worker is activated, the multiplexor calls fork() and
    runs the **mimedefang.pl** main loop. This invokes
    **filter_initialize** and then runs the main loop.

On some platforms (for example, Red Hat Linux 7.3 with Perl 5.6.1), it
is not safe to destroy and recreate a Perl interpreter without causing a
memory leak. On those platforms, if you attempt to reread the filter
file (by sending the multiplexor a HUP signal or reread command), the
filter will *not* be re-read, and a message will be logged to syslog. On
those platforms, you must kill and restart MIMEDefang if you change the
filter file.

On most platforms, however, a filter reread is accomplished by
destroying and re-creating the embedded interpreter, re-sourcing
**mimedefang.pl** and killing workers as soon as they are idle.

# STATISTICS

With the **-t** option, **mimedefang-multiplexor** logs certain events
to a file. This file can be post-processed to gather statistics about
the multiplexor. You can use it to tune the number of workers you run,
adjust timeouts, and so on.

Each line of the file looks like this:

    	YYYY/MM/DD:HH:MM:SS timestamp event key=val key=val...

Here, YYYY/MM/DD:HH:MM:SS is the local time of day. Timestamp is the
number of seconds since January 1, 1970. Event is the name of an event.
The valid events are:

**StartWorker**

:   A worker process has been started.

**KillWorker**

:   A worker process has been killed.

**ReapWorker**

:   A dead worker process has been reaped. It is possible to have a
    ReapWorker event without a previous KillWorker event if the worker
    process terminated abnormally.

**StartFilter**

:   A worker process has begun filtering an e-mail message.

**EndFilter**

:   A worker process has finished filtering an e-mail message.

The possible keys in the key=value pairs are:

**worker=*n***

:   The worker involved in the event. Every worker is identified by a
    small integer.

**nworkers=*n***

:   The total number of running workers immediately after the event
    happened.

**nbusy=*n***

:   The number of busy workers (workers which are processing an e-mail
    message) immediately after the event happened.

**reason=\"*string***\"****

:   The reason for a StartWorker or KillWorker event. (Present only for
    these events.)

**numRequests=*n***

:   The number of e-mails processed by the worker. Present only for an
    EndFilter event.

If you send the **mimedefang-multiplexor** process a SIGHUP signal (kill
-1 *pid*), it closes and reopens the statistics file. This is useful
during log file rotation.

If you send the **mimedefang-multiplexor** process a SIGINT signal (kill
-INT *pid*), it terminates all active-but-idle workers. Also, any
active-and-busy workers terminate as soon as they finish filtering the
current message. This is useful to force a reread of the filter rules
file without stopping and restarting Sendmail.

If you send the **mimedefang-multiplexor** process a SIGTERM signal
(kill *pid*), it terminates all workers and exits immediately.

# AUTHOR

**mimedefang-mulitplexor** was written by Dianne Skoll
\<dfs\@roaringpenguin.com>. The **mimedefang** home page is
*http://www.mimedefang.org/*.

# SEE ALSO

mimedefang.pl(8), mimedefang-filter(5), mimedefang(8),
mimedefang-protocol(7)
