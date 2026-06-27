Title: Getting Started with MIMEDefang
Description: A step-by-step guide to installing MIMEDefang, writing your first filter, and starting the service.
Author: gbechis
Slug: getting-started/index
Status: published
Template: documentation

## Getting Started with MIMEDefang

MIMEDefang is a mail filtering framework that hooks into Sendmail or Postfix via the Milter API. You write your filtering logic in Perl; MIMEDefang handles the integration with the MTA.

---

## Prerequisites

- **MTA** – Sendmail 8.12+ with milter support, or Postfix 2.3+ with milter support enabled.
- **Perl** – Perl 5.10 or later with the `MIME::Tools` distribution installed.
- **Root access** – required for installation and service management.

---

## Installation

### From a package manager (recommended)

On Fedora / RHEL / CentOS:

```
dnf install mimedefang
```

On Debian / Ubuntu:

```
apt-get install mimedefang
```

### From source

```
./configure
make
make install
```

The default installation places binaries in `/usr/bin/` and looks for the filter script at `/etc/mail/mimedefang-filter`.

---

## Your First Filter

MIMEDefang reads its filtering logic from a Perl file called `mimedefang-filter`. A minimal filter that accepts every message looks like this:

```perl
sub filter_end {
    return action_accept();
}

1;
```

Save this as `/etc/mail/mimedefang-filter`. You can test it before starting the daemon:

```
mimedefang.pl -f /etc/mail/mimedefang-filter /path/to/test/dir
```

This runs your filter offline against a message directory and reports any errors.

---

## Starting the Service

MIMEDefang consists of two processes. The multiplexor manages a pool of Perl workers; the main daemon communicates with the MTA.

### With systemd

```
systemctl enable --now mimedefang
```

### Manually

Start the multiplexor first, then the daemon:

```
mimedefang-multiplexor -p /var/run/mimedefang/mimedefang-multiplexor.sock \
    -f /etc/mail/mimedefang-filter

mimedefang -p inet:8998@localhost \
    -m /var/run/mimedefang/mimedefang-multiplexor.sock \
    -U defang
```

Consult the [mimedefang(8)](../man_mimedefang.html) and [mimedefang-multiplexor(8)](../man_mimedefang-multiplexor.html) man pages for the full list of options.

---

## Telling Your MTA to Use the Filter

### Sendmail

Add this line to your `sendmail.mc` and rebuild:

```
INPUT_MAIL_FILTER(`mimedefang', `S=inet:8998@localhost, F=T, T=S:360s;R:360s;E:15m')
```

### Postfix

Postfix communicates with MIMEDefang through the milter (mail filter) interface. You need Postfix 2.3 or later.

**1. Choose a socket type**

MIMEDefang can listen on either a TCP socket or a Unix socket.

TCP (simpler, works across hosts):

```
mimedefang -p inet:8998@127.0.0.1 \
    -m /var/run/mimedefang/mimedefang-multiplexor.sock \
    -U defang
```

Unix socket (lower overhead, same host only):

```
mimedefang -p local:/var/run/mimedefang/mimedefang.sock \
    -m /var/run/mimedefang/mimedefang-multiplexor.sock \
    -U defang
```

**2. Register the milter in `main.cf`**

For a TCP socket:

```
smtpd_milters = inet:127.0.0.1:8998
non_smtpd_milters = inet:127.0.0.1:8998
milter_default_action = accept
```

For a Unix socket:

```
smtpd_milters = unix:/var/run/mimedefang/mimedefang.sock
non_smtpd_milters = unix:/var/run/mimedefang/mimedefang.sock
milter_default_action = accept
```

- `smtpd_milters` applies the filter to mail received over SMTP.
- `non_smtpd_milters` applies it to locally submitted mail (e.g. from `sendmail` or `pickup`). Omit this line if you only want to filter inbound SMTP.
- `milter_default_action = accept` tells Postfix to accept mail if MIMEDefang is unavailable, avoiding a mail outage during restarts.

**3. Reload Postfix**

```
postfix reload
```

Postfix will now pass every incoming message through MIMEDefang before delivery.

---

## Next Steps

- Browse the [code snippets](/snippets/) for ready-to-use filter examples (spam checks, DKIM signing, greylisting, and more).
- Read the [mimedefang-filter(5)](../man_mimedefang-filter.html) man page for the complete filter callback reference.
- Explore the full [API documentation](/documentation/) for all available Perl modules.
- Ask questions on the [mailing list](/mailing-list/).
