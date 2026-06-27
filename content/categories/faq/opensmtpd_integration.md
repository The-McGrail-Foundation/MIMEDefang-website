Title: How do I integrate MIMEDefang with OpenSMTPD?
Date: 2026-06-27 00:00:00
Category: faq
Num: 019
Audience: admin
Status: published

OpenSMTPD has supported the Milter protocol since version 6.7.0. MIMEDefang can be used as a Milter filter with OpenSMTPD.

The socket OpenSMTPD connects to is the **Milter socket** created by `mimedefang`. It is set via the **`-p`** option of `mimedefang` (not via a wrapper-script variable). The separate **multiplexor socket** (used internally between `mimedefang` and its Perl workers) is set via **`-s`** on `mimedefang-multiplexor` and **`-m`** on `mimedefang`. See [mimedefang(8)](/man/mimedefang) and [mimedefang-multiplexor(8)](/man/mimedefang-multiplexor) for details.

**Step 1**: Start `mimedefang-multiplexor` and `mimedefang` with explicit socket paths, for example:

    mimedefang-multiplexor -s /var/spool/MIMEDefang/mx.sock [other options]
    mimedefang -p unix:/var/spool/MIMEDefang/mimedefang.sock \
               -m /var/spool/MIMEDefang/mx.sock \
               -U defang [other options]

If you installed from a distribution package, a configuration file may already be present at `/etc/sysconfig/mimedefang` (RPM-based systems) or `/etc/default/mimedefang` (Debian-based systems). If it exists, set the socket paths there rather than editing the startup script directly.

**Step 2**: Add a filter definition to `/etc/mail/smtpd.conf`, using the same path passed to `mimedefang -p`:

    filter mimedefang proc-exec "filter-milter unix:/var/spool/MIMEDefang/mimedefang.sock"

If your OpenSMTPD version uses the older `filter` syntax (6.7.x), declare the Milter filter with:

    filter mimedefang milter socket "unix:/var/spool/MIMEDefang/mimedefang.sock"

**Step 3**: Apply the filter to your SMTP listener(s):

    listen on all filter mimedefang

**Step 4**: Ensure the `_smtpd` user has read/write access to the MIMEDefang socket directory.

**Step 5**: Check and reload the configuration:

    smtpd -n && rcctl reload smtpd

Note that OpenSMTPD's Milter support covers a subset of the full Milter API. Features that rely on `SMFIF_CHGFROM` (envelope sender rewriting) or `SMFIF_ADDRCPT_PAR` may not be available on all OpenSMTPD versions.
