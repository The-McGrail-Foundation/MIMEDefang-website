Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_md-mx-ctrl
Status: published
Template: documentation

# NAME

md-mx-ctrl - Control mimedefang-multiplexor

# SYNOPSIS

**md-mx-ctrl \[*options*\] *command***

# DESCRIPTION

**md-mx-ctrl** is a command-line tool for communicating with
**mimedefang-multiplexor**(8).

# OPTIONS

**-h**

:   Displays usage information.

**-s *path***

:   Specifies the path to the **mimedefang-multiplexor** socket. If not
    specified, defaults to
    /var/spool/MIMEDefang/mimedefang-multiplexor.sock.

**-i**

:   This flag causes **md-mx-ctrl** to sit in a loop, reading commands
    on standard input and printing results to standard output. It is
    intended for use by a monitoring program such as
    **watch-mimedefang**.

# COMMANDS

The following commands are available:

**status**

:   Prints the status of all worker Perl processes in human-readable
    format.

**rawstatus**

:   Prints the status of all worker Perl processes in a format easy to
    parse by computer. The result is a single line with six words on it.
    The words are separated by a single space character.

Each character in the first word corresponds to a worker, and is \"I\"
for an idle worker, \"B\" for a busy worker, \"S\" for a worker which is
not running, and \"K\" for a worker which has been killed, but has not
yet exited. A worker is \"idle\" if there is a running Perl process
waiting to do work. \"Busy\" means the Perl process is currently
filtering a message. \"S\" means there is no associated Perl process
with the worker, but one can be started if the load warrants. Finally,
\"K\" means the worker Perl process has been killed, but has yet to
terminate.

The second word is the total number of messages processed since the
multiplexor started up. The third word is the total number of workers
which have been activated since the multiplexor started up. (That is,
it\'s a count of the number of times the multiplexor has forked and
exec\'d the Perl filter.)

The fourth word is the size of the queue for request queuing, and the
fifth word is the actual number of requests in the queue. The sixth word
is the number of seconds elapsed since the multiplexor was started.

**barstatus**

:   Prints the status of busy workers and queued requests in a nice
    \"bar chart\" format. This lets you keep an eye on things with a
    script like this:

    	while true ; do
    		md-mx-ctrl barstatus
    		sleep 1
    	done

**histo**

:   Prints a histogram showing the number of workers that were busy each
    time a request was processed. A single line is printed for the
    numbers from 1 up to the maximum number of workers. Each line
    contains the count of busy workers (1, 2, 3 up to MX_MAXIMUM), a
    space, and the number of times that many workers were busy when a
    request was processed.

**load**

:   Prints a table showing \"load averages\" for the last 10 seconds, 1
    minute, 5 minutes and 10 minutes.

Each row in the table corresponds to a time interval, displayed in the
first column. The remaining columns in the table are:

**Msgs:** The number of messages scanned within the row\'s time
interval.

**Msgs/Sec:** The average number of messages scanned per second within
the row\'s time interval.

**Avg Busy Workers:** The average number of busy workers whenever a
message was scanned. (If you are processing any mail at all, this number
will be at least 1, because there is always 1 busy worker when a message
is scanned.)

If you have the **watch**(1) command on your system, you can keep an eye
on the load with this command:

    	watch -n 10 md-mx-ctrl load

If you do not have **watch**, the following shell script is a less fancy
equivalent:

    	#!/bin/sh
    	while true; do
    		clear
    		date
    		md-mx-ctrl load
    		sleep 10
    	done

**rawload**

:   Prints the load averages in computer-readable format. The format
    consists of twenty-nine space-separated numbers:

The first four are integers representing the number of messages scanned
in the last 10 seconds, 1 minute, 5 minutes and 10 minutes.

The second four are floating-point numbers representing the average
number of busy workers in the last 10 seconds, 1 minute, 5 minutes and
10 minutes.

The third four are floating-point numbers representing the average time
per scan in milliseconds over the last 10 seconds, 1 minute, 5 minutes
and 10 minutes.

The fourth four are the number of worker activations (new workers
started) over the last 10 seconds, 1 minute, 5 minutes and 10 minutes.

The fifth four are the number of workers reaped (workers that have
exited) over the last 10 seconds, 1 minute, 5 minutes and 10 minutes.

The sixth four are the number of busy, idle, stopped and killed workers.

The seventh four are the number of messages processed, the number of
worker activations, the size of the request queue, and the number of
requests actually on the queue.

The final number is the number of seconds since the multiplexor was
started.

**load-relayok**

:   Similar to **load**, but shows timings for **filter_relay** calls.

**load-senderok**

:   Similar to **load**, but shows timings for **filter_sender** calls.

**load-recipok**

:   Similar to **load**, but shows timings for **filter_recipient**
    calls.

**rawload-relayok**

:   Similar to **rawload**, but shows timings for **filter_relay**
    calls. Note that the worker activation and reap statistics are
    present, but always 0. They are only valid in a **rawload** command.

**rawload-senderok**

:   Similar to **rawload**, but shows timings for **filter_sender**
    calls. Note that the worker activation and reap statistics are
    present, but always 0. They are only valid in a **rawload** command.

**rawload-recipok**

:   Similar to **rawload**, but shows timings for **filter_recipient**
    calls. Note that the worker activation and reap statistics are
    present, but always 0. They are only valid in a **rawload** command.

**load1 *nsecs***

:   The **load1** command displays the load for various commands over
    the last *nsecs* seconds, where *nsecs* is an integer from 10
    to 600. The **load1** command combines the output of **load**,
    **load-relayok**, **load-senderokf** and **load-recipok** into one
    display.

You might use the command like this:

    	watch -n 10 md-mx-ctrl load1 60

**rawload1 *nsecs***

:   Returns the **load1** data in human-readable format. The result is a
    line containing twenty-six space-separated numbers:

The first three numbers are the number of scans performed in the last
*nsecs* seconds, the average number of busy workers when a scan was
initiated and the average number of milliseconds per scan.

The second three are the same measurements for **filter_relay** calls.

The third three are the same measurements for **filter_sender** calls.

The fourth three are the same measurements for **filter_relay** calls.

The thirteenth through sixteenth numbers are the number of busy, idle,
stopped and killed workers, respectively.

The seventeenth number is the number of scans since
**mimedefang-multiplexor** was started.

The eighteenth number is the number of times a new worker has been
activated since program startup.

The nineteenth number is the size of the request queue and the twentieth
number is the actual number of queued requests.

The twenty-first number is the time since program startup and the
twenty-second number is a copy of *nsecs* for convenience.

The twenty-third through twenty-sixth numbers are the number of workers
currently executing a scan, relayok, senderok and recipok command
respectively.

**workers**

:   Displays a list of workers and their process IDs. Each line of
    output consists of a worker number, a status (I, B, K, or S), and
    for idle or busy workers, the process-ID of the worker. For busy
    workers, the line may contain additional information about what the
    worker is doing. The command **slaves** is a deprecated synonym for
    this command.

**busyworkers**

:   Similar to **workers**, but only outputs a line for each busy
    worker. The command **busyslaves** is a deprecated synonym for this
    command.

**workerinfo *n***

:   Displays information about worker number *n*. The command
    **slaveinfo** is a deprecated synonym for this command.

**reread**

:   Forces **mimedefang-multiplexor** to kill all idle workers, and
    terminate and restart busy workers when they become idle. This
    forces a reread of filter rules.

**msgs**

:   Prints the total number of messages scanned since the multiplexor
    started.

# ADDITIONAL COMMANDS

You can supply any other command and arguments to **md-mx-ctrl**. It
percent-encodes each command-line argument, glues the encoded arguments
together with a single space between each, and sends the result to the
multiplexor as a command. This allows you to send arbitrary commands to
your Perl workers. See the section \"EXTENDING MIMEDEFANG\" in
**mimedefang-filter**(5) for additional details.

# PERMISSIONS

**md-mx-ctrl** uses the multiplexor\'s socket; therefore, it probably
needs to be run as *root* or the same user as
**mimedefang-multiplexor**.

# AUTHOR

**md-mx-ctrl** was written by Dianne Skoll \<dfs\@roaringpenguin.com>.
The **mimedefang** home page is *http://www.mimedefang.org/*.

# SEE ALSO

mimedefang.pl(8), mimedefang-filter(5), mimedefang(8),
mimedefang-protocol(7), watch-mimedefang(8)
