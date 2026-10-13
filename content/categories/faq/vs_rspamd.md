Title: Should I use MIMEDefang or rspamd?
Date: 2026-10-13 00:00:00
Category: faq
Description: MIMEDefang and rspamd solve different problems and work well together: rspamd scores spam, MIMEDefang applies your Perl mail policy.
Num: 023
Audience: admin
Status: published

You can use both. rspamd is a fast spam-scoring engine. MIMEDefang is a mail-policy framework that lets you write per-site rules in Perl over the envelope, headers and MIME tree.

MIMEDefang can call rspamd through `rspamd_check` and act on its verdict: reject, tag, quarantine or rewrite the message. If you only need spam scoring with a web UI and no code, rspamd on its own may be enough.

See [MIMEDefang vs rspamd and amavisd-new](/comparison/) for details.
