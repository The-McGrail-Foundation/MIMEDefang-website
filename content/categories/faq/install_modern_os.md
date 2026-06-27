Title: How do I install MIMEDefang on a modern OS using packages?
Date: 2026-06-27 00:00:00
Category: faq
Num: 020
Audience: admin
Status: published

Modern Linux distributions and BSDs ship MIMEDefang as a ready-to-install package, so you do not need a C compiler or manual source compilation. Milter support is also enabled by default in the Sendmail and Postfix packages on these systems.

**Fedora / RHEL 9+ / AlmaLinux / Rocky Linux**

    dnf install mimedefang

On RHEL 8 and CentOS Stream 8, enable EPEL first:

    dnf install epel-release
    dnf install mimedefang

**Debian / Ubuntu**

    apt install mimedefang

**FreeBSD**

Install from ports:

    cd /usr/ports/mail/mimedefang && make install clean

Or with pkg:

    pkg install mimedefang

**OpenBSD**

    pkg_add mimedefang

**After installation**

Enable and start the service with your system's service manager (e.g. `systemctl enable --now mimedefang` on systemd-based systems, or `rcctl enable mimedefang` on OpenBSD).

Edit the filter script at `/etc/mail/mimedefang-filter` (or the path shown by `mimedefang -help`) to suit your site's policy, then connect MIMEDefang to your MTA as described in the Postfix or Sendmail integration FAQs.
