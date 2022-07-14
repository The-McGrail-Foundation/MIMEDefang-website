Title: What tests is SpamAssassin running? Can I test its configuration?
Date: 2021-07-14 18:40:30
Category: faq
Num: 009
Status: published

MIMEDefang runs as the configured defang user, hence, SpamAssassin’s integration into MIMEDefang runs as this user, too.

In order to test the configuration use this command (as root):

su defang -s /bin/bash -c ‘spamassassin -x -p /etc/mail/sa-mimedefang.cf -D –lint’

-   use the correct name for defang you have configured to run MIMEDefang under,
-   use the correct path for the MIMEDefang-SpamAssassin configuration file /etc/mail/sa-mimedefang.cf
-   -s /bin/bash ensures that su uses a valid shell, because normally the defang user does not need one
-   instead of –lint you can pipe or redirect any message to check into this call, e.g.:  
   su defang -s /bin/bash -c ‘spamassassin -x -p /etc/mail/sa-mimedefang.cf -D’ \< message
