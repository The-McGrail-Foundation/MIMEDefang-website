Title: Is MIMEDefang an alternative to amavisd-new?
Date: 2026-10-13 00:00:00
Category: faq
Description: MIMEDefang can replace amavisd-new: it is a native milter that runs Perl policies during the SMTP transaction and can rewrite MIME parts.
Num: 022
Audience: admin
Status: published

Yes. Both are written in Perl and both can use SpamAssassin, rspamd and antivirus scanners, but MIMEDefang is a native milter. It runs your policy *during* the SMTP transaction, so you can reject mail before accepting it, with no backscatter. It also lets you rewrite any MIME part: drop or replace attachments, add disclaimers, or change headers.

amavisd-new usually runs as an after-queue `content_filter`. To migrate, replace the `content_filter` line with an `smtpd_milters` entry and port your policies into the MIMEDefang filter.

See [MIMEDefang vs rspamd and amavisd-new](/comparison/) for a full comparison and a migration checklist.
