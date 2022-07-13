Title: FAQ
Date: 2021-07-09 22:57
Author: admin_f0tn7wrk
Slug: faq
save_as: faq.html
Status: published
Template: faq

## FAQ

* [What is MIMEDefang?](#collapseExample0)

<div class="collapse-div collapse" id="collapseExample0"><pre>
MIMEDefang is a framework for filtering e-mail. It uses Sendmail’s “Milter” API, some C glue code, and some Perl code to let you write high-performance mail filters in Perl.

People use MIMEDefang to:

-   Block viruses
-   Block or tag spam
-   Remove HTML mail parts
-   Add boilerplate disclaimers to outgoing mail
-   Remove or alter attachments
-   Replace attachments with URL’s
-   Implement sophisticated access controls.

You’re limited only by your imagination. If you can think of it and code it in Perl, you can do it with MIMEDefang.
</pre></div>

* [What are the prerequisites for installing MIMEDefang?](#collapseExample1)

<div class="collapse-div collapse" id="collapseExample1"><pre>
The following software is required for MIMEDefang:

-   A UNIX or UNIX-like operating system. MIMEDefang is known to run on Linux, FreeBSD, OpenBSD, NetBSD, Solaris, HP-UX, Tru64 UNIX, and AIX.
-   Sendmail 8.12 or newer with Milter support, or Postfix with Milter support.
-   Perl 5.8.9 or newer.
-   The following Perl modules:
    -   MIME::tools 5.420 or higher
    -   IO::Stringy 1.212 or higher
    -   MIME::Base64 2.11 or higher
    -   MailTools 1.1401 or higher
    -   Digest::SHA1 2.00 or higher
-   (Optional) Other Perl modules like Mail::SpamAssassin
-   A C compiler and C development environment
</pre></div>

* [How do I install MIMEDefang?](#collapseExample2)

<div class="collapse-div collapse" id="collapseExample2"><pre>
First, download MIMEDefang from the <a href="https://mimedefang.org/download/">download page</a>.

Next, unpack the MIMEDefang tar file and follow the instructions in the README file.  
Depending on how your Sendmail binary was compiled, you may need to recompile it to add Milter support.  
Note that modern systems Milter support included in their versions of Sendmail.

Please note that you need a UNIX or UNIX-like system with Perl and a C development environment to install MIMEDefang from source.
</pre></div>

* [What is the architecture of MIMEDefang?](#collapseExample3)

<div class="collapse-div collapse" id="collapseExample3"><pre>
The MIMEDefang system consists of three main programs:

-   mimedefang is a C “Milter” program. It talks directly to Sendmail using the multi-threaded Milter library.
-   mimedefang-multiplexor is a C program that accepts requests from mimedefang and forwards them to one of a pool of slave Perl processes.
-   mimedefang.pl is a Perl program that does the actual mail filtering. The multiplexor manages a pool of these processes, forwarding idle processes work and reading the results.

A complete description of the architecture may be found in the PDF <a href="https://mimedefang.org/static/mimedefang-lisa04.pdf" target="_blank">presentation slides</a>.
</pre></div>

* [Why is SpamAssassin not found even though it is installed?](#collapseExample4)

<div class="collapse-div collapse" id="collapseExample4"><pre>
-  Symptom: When you build MIMEDefang, it detects SpamAssassin just fine. But when you run it, it doesn’t seem to find the SpamAssassin Perl modules.

-  Probable Cause: This is often caused by a permissions problem. Make sure all of the SpamAssassin Perl modules and data files are world-readable.

-  Underlying Cause: What made the file permissions wrong in the first place? Some installation scripts will explicitly change the permissions on all files they install.  
Others will just create the files, meaning they get created with whatever are the default permissions for the user.  
Since most installs are done by root, you need to look at root’s `umask` setting to see what the default permissions are.
</pre></div>

* [Why don't SpamAssassin DCC/Razor/RBL checks work?](#collapseExample5)

<div class="collapse-div collapse" id="collapseExample5"><pre>
-  Symptom: Network-related SpamAssassin tests don’t seem to have any effect.

-  Probable Cause: These tests must be specially enabled when SpamAssassin is used in conjunction with MIMEDefang. To enable them, you must do two things:

1.  Enable them in the file `/etc/mail/spamassassin/sa-mimedefang.cf`. MIMEDefang uses this file for its global SpamAssassin configuration.
2.  In your filter, add the line: `\$SALocalTestsOnly = 0;`

You may also need to add these lines to `/etc/mail/spamassassin/sa-mimedefang.cf`:

              use_dcc 1
              dcc_timeout 10
              dcc_path /usr/local/bin/dccproc


(Substitute appropriate paths for your system.)
</pre></div>

* [When I add a To: header, why doesn't the recipient receive a copy of the e-mail?](#collapseExample6)

<div class="collapse-div collapse" id="collapseExample6"><pre>
-  Symptom: I used `action_add_header` to add a new “To:” (or “Cc:” or “Bcc:”) field to a message,  
or used `action_change_header` to change the “To:” field, but the message didn’t go where I thought it should.

-  Cause: Changing headers does *not* change the destination of the email message.  
That is controlled by the envelope recipient(s) in the SMTP dialog.  
You will have to use `add_recipient` and/or `delete_recipient` to change the destination for a message.
</pre></div>

* [Why won't SpamAssassin tag a message subject?](#collapseExample7)

<div class="collapse-div collapse" id="collapseExample7"><pre>
-  Symptom: I configured SpamAssassin to add the spam score to the subject, but it won’t do it.

-  Cause: When you run SpamAssassin under MIMEDefang, SpamAssassin *cannot change the message in any way*.  
If you want to add any spam-related headers, you will have to do this in your rules file (mimedefang-filter).  
Most people seem to do this in `filter_end` (after all parts have been checked for viruses).  
The sample filter has code to call SA and add an X-Spam-Score: header to messages SA tags as spam.

If you want to change the subject, use something like this in `filter_end:`

              action_change_header('Subject', "***SPAM*** $Subject");
</pre></div>

* [Why are my logs filling up with "Milter change: header..." entries?](#collapseExample8)

<div class="collapse-div collapse" id="collapseExample8"><pre>
-  Symptom: I am running MIMEDefang, but now I am getting a lot of messages in my syslog that look like this:

`Milter change: header MIME-Version: from 1.0 to 1.0`

-  Cause: It is actually the Milter engine of sendmail that is logging all those. To reduce the amount of logging, try putting this line:

`define(\`confMILTER_LOG_LEVEL', \`8')dnl`

in your `sendmail.mc` file and then re-generate your `sendmail.cf`.
</pre></div>

* [What tests is SpamAssassin running? Can I test its configuration?](#collapseExample9)

<div class="collapse-div collapse" id="collapseExample9"><pre>
MIMEDefang runs as the configured defang user, hence, SpamAssassin’s integration into MIMEDefang runs as this user, too.

In order to test the configuration use this command (as root):

su defang -s /bin/bash -c ‘spamassassin -x -p /etc/mail/sa-mimedefang.cf -D –lint’

-   use the correct name for defang you have configured to run MIMEDefang under,
-   use the correct path for the MIMEDefang-SpamAssassin configuration file /etc/mail/sa-mimedefang.cf
-   -s /bin/bash ensures that su uses a valid shell, because normally the defang user does not need one
-   instead of –lint you can pipe or redirect any message to check into this call, e.g.:  
   su defang -s /bin/bash -c ‘spamassassin -x -p /etc/mail/sa-mimedefang.cf -D’ \< message
</pre></div>

* [How to setup a RAM disk in Linux?](#collapseExample10)

<div class="collapse-div collapse" id="collapseExample10"><pre>
`/bin/mount -t tmpfs -o size=500m,mode=0700,uid=${md_user},gid=${md_group} /dev/shm $md_spooldir`

`/dev/shm` is provided in most newer Linux systems, maybe `none` works for you, too.

Adjust the size, of course.

Replace `${md_user}` and `${md_group}` with the appropriate UID and GID, in order to give MIMEDefang **write** permission to the directories.

Replace `${md_spooldir}` with the directory specified with the `--with-spooldir=` option during the `./configure` of MIMEDefang.

The idea is to have all temporary files of MIMEDefang been spooled on a very fast RAM disk. None of these files are required after SMTP phase is over. Hence, make sure that `--with-quarantinedir=` points somewhere else!
</pre></div>

* [Why are you spamming me?](#collapseExample11)

<div class="collapse-div collapse" id="collapseExample11"><pre>
Many people see e-mails with the following header:

    X-Scanned-By: MIMEDefang x.y
        (www dot mimedefang dot org slash enduser)

That does *not* mean that Mimedefang administrators are in any way associated with the e-mail.  
It simply means that your ISP, or the ISP of the sender, is using the <a href="https://mimedefang.org">MIMEDefang</a> mail scanner to scan for viruses.
</pre></div>

* [Who altered my e-mail?](#collapseExample12)

<div class="collapse-div collapse" id="collapseExample12"><pre>
Your system administrator or ISP has installed a scanning program which modified your e-mail.

*Mimedefang administrators are not responsible for things people do with MIMEDefang;  
if you do not like the way your mail is processed, please do not complain to us. It will do no good.*
</pre></div>

* [Why was the e-mail altered?](#collapseExample13)

<div class="collapse-div collapse" id="collapseExample13"><pre>
Your system administrator or ISP has implemented a policy defining unacceptable e-mail attachments.  
Each incoming e-mail is scanned for attachments and unacceptable ones may be removed or altered.

If you have concerns about the scanning policy, please talk to your system administrator or ISP support desk.
</pre></div>

* [I didn't send a virus -- why does your software claim I did?](#collapseExample14)

<div class="collapse-div collapse" id="collapseExample14"><pre>
Many viruses forge the sender’s address. By default, MIMEDefang does *not* send notifications to virus senders for this very reason.  
We strongly recommend to MIMEDefang administrators that they do not change this behaviour.

However, some MIMEDefang administrators insist on sending notifications to the apparent sender of a virus.  
This is bad behaviour, but we *cannot* control it. Complain to the ISP in question, or blacklist it until it fixes the configuration.
</pre></div>

* [How is MIMEDefang licensed and what rules must I abide by?](#collapseExample15)

<div class="collapse-div collapse" id="collapseExample15"><pre>
The <a href="mimedefang-project-charter.html">MIMEDefang Project Charter</a> properly listed out the terms and conditions in which users may interact with the software.
</pre></div>

* [How does the MIMEDefang Project Operate?](#collapseExample16)

<div class="collapse-div collapse" id="collapseExample16"><pre>
MIMEDefang project management is described at the <a href="mimedefang-project-charter.html">PMC page</a>.
</pre></div>
