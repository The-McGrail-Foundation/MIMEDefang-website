Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_mimedefang-notify
Status: published
Template: documentation


# NAME

mimedefang-notify - Conventions used by **mimedefang-multiplexor**(8) to
notify an external program of state changes.

# DESCRIPTION

If you supply the **-O** option to **mimedefang-multiplexor**, then it
allows external programs to connect to a socket and be notified of
certain state changes in the multiplexor. The external programs can
react in whatever way they choose to these state changes. The external
program that listens for state changes is referred to as a *listener*.

# NOTIFICATION OVERVIEW

From the point of view of a listener, notification works like this:

1) The listener connects to a TCP or UNIX-domain socket.

2) The listener informs **mimedefang-multiplexor** of the *message
types* it is interested in.

3) The listener loops, reading messages from the socket and reacting to
them.

# MESSAGES

Each message from the multiplexor normally consists of a single
upper-case letter, possibly followed by a space and some arguments, and
then followed by a newline.

Two special messages are "*OK" followed by a newline, which is issued
when a listener first connects, and "*ERR" followed by some text and
a newline, which is issued when an error occurs.

The normal messages are:

**B**

:   This message is issued whenever a worker is killed because of a busy
    timeout.

**F** *n*

:   This message is issued whenever the number of free workers changes.
    The parameter *n* is the number of free workers.

**R**

:   This message is issued whenever someone has forced a filter reread.

**S** *n* *nmsg*

:   This message is issued whenever worker *n*'s status tag changes.
    The status tag is a string indicating what the worker is currently
    doing; the **-Z** option to the multiplexor allows the Perl code to
    update the status tag so you have a good idea what each worker is
    doing.

**U**

:   This message is issued whenever a worker has died unexpectedly.

**Y**

:   This message is issued whenever the number of free workers changes
    from zero to non-zero.

**Z**

:   This message is issued whenever the number of free workers falls to
    zero.

# EXPRESSING INTEREST

A listener does not receive any messages until it has *expressed
interest* in various message types. To express interest, the listener
should send a question mark ("?") followed by the types of messages it
is interested in, followed by a newline over the socket. For example, a
listener interested in the R and F messages would send this line:

?RF

A listener interested in every possible message type should send:

?*

Once a listener has expressed interest, it may receive messages at any
time, and should monitor the socket for messages.

Note that a listener *always* receives the special messages "*OK" and
"*ERR", even if it has not expressed interest in them.

# EXAMPLE

The following Perl script implements a listener that, on Linux, rejects
new SMTP connections if all workers are busy, and accepts them again
once a worker is free. Existing SMTP connections are not shut down; the
system merely refuses new connections if all the workers are busy.

This script assumes that you have used the **-O inet:4567** option to
**mimedefang-multiplexor**.

    #!/usr/bin/perl -w
    #
    # On Linux, prepare to use this script like this:
    #     /sbin/iptables -N smtp_connect
    #     /sbin/iptables -A INPUT --proto tcp --dport 25 --syn -j smtp_connect
    # Then run the script as root.

    use IO::Socket::INET;

    sub no_free_workers {
        print STDERR "No free workers!\n";
        system("/sbin/iptables -A smtp_connect -j REJECT");
    }

    sub some_free_workers {
        print STDERR "Some free workers.\n";
        system("/sbin/iptables -F smtp_connect");
    }

    sub main {
        my $sock;

        $sock = IO::Socket::INET->new(PeerAddr => '127.0.0.1',
                                      PeerPort => '4567',
                                      Proto => 'tcp');
        # We are only interested in Y and Z messages
        print $sock "?YZ\n";
        $sock->flush();
        while(<$sock>) {
            if (/^Z/) {
                no_free_workers();
            }
            if (/^Y/) {
                some_free_workers();
            }
        }

        # EOF from multiplexor?? Better undo firewalling
        system("/sbin/iptables -F smtp_connect");
    }

    main();

# SEE ALSO

mimedefang.pl(8), mimedefang(8), mimedefang-multiplexor(8),
mimedefang-filter(5)
