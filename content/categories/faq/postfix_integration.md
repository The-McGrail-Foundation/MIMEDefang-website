Title: How do I integrate MIMEDefang with Postfix?
Date: 2026-06-27 00:00:00
Category: faq
Num: 018
Audience: admin
Status: published

MIMEDefang communicates with Postfix via the Milter protocol. Postfix has supported Milter since version 2.3.

The MIMEDefang system uses two separate sockets:

- The **Milter socket** is created by `mimedefang` (the C milter daemon) and is the one Postfix connects to. It is configured with the **`-p`** option of `mimedefang`.
- The **multiplexor socket** is created by `mimedefang-multiplexor` and is used for communication between `mimedefang` and the Perl worker pool. It is configured with the **`-s`** option of `mimedefang-multiplexor` and referenced by the **`-m`** option of `mimedefang`.

**Step 1**: Set the milter socket when starting `mimedefang-multiplexor` and `mimedefang`. For example:

    mimedefang-multiplexor -s /var/spool/MIMEDefang/mx.sock [other options]
    mimedefang -p unix:/var/spool/MIMEDefang/mimedefang.sock \
               -m /var/spool/MIMEDefang/mx.sock \
               -U defang [other options]

Refer to [mimedefang(8)](/man/mimedefang) and [mimedefang-multiplexor(8)](/man/mimedefang-multiplexor) for the full list of options. If you installed MIMEDefang from a distribution package, the startup script or systemd unit file already sets these parameters via a configuration file. On RPM-based systems that file may be present at `/etc/sysconfig/mimedefang`; on Debian-based systems it may be at `/etc/default/mimedefang`. If the file exists, set the socket paths there rather than editing the startup script directly.

**Step 2**: Add the following lines to `/etc/postfix/main.cf`, using the same path you passed to `mimedefang -p`:

    smtpd_milters = unix:/var/spool/MIMEDefang/mimedefang.sock
    non_smtpd_milters = unix:/var/spool/MIMEDefang/mimedefang.sock
    milter_default_action = accept

- `smtpd_milters` applies the filter to mail received via the SMTP daemon.
- `non_smtpd_milters` applies the filter to locally-submitted mail (e.g. from `sendmail(1)`). Omit this line if you only want to filter inbound SMTP mail.
- `milter_default_action = accept` instructs Postfix to accept mail if MIMEDefang is temporarily unavailable, preventing mail loss during restarts.

**Step 3**: Ensure the `postfix` user (or the user Postfix runs as) has read permission on the MIMEDefang spool directory so it can connect to the milter socket.

**Step 4**: Reload Postfix:

    postfix reload
