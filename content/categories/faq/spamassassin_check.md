Title: Why don't SpamAssassin DCC/Razor/RBL checks work?
Date: 2021-07-14 18:40:30
Category: faq
Num: 005
Status: published

**Symptom**: Network-related SpamAssassin tests don’t seem to have any effect.

**Probable Cause**: These tests must be specially enabled when SpamAssassin is used in conjunction with MIMEDefang. To enable them, you must do two things:

1.  Enable them in the file `/etc/mail/spamassassin/sa-mimedefang.cf`. MIMEDefang uses this file for its global SpamAssassin configuration.
2.  In your filter, add the line: `$SALocalTestsOnly = 0;`

You may also need to add these lines to `/etc/mail/spamassassin/sa-mimedefang.cf`:

              use_dcc 1
              dcc_timeout 10
              dcc_path /usr/local/bin/dccproc


(Substitute appropriate paths for your system.)
