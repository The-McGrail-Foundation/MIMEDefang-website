Title: How do I install MIMEDefang?
Date: 2021-07-14 18:40:30
Category: faq
Num: 002
Status: published

First, download MIMEDefang from the [download page](https://mimedefang.org/download/").

Next, unpack the MIMEDefang tar file and follow the instructions in the README file.  
Depending on how your Sendmail binary was compiled, you may need to recompile it to add Milter support.  
Note that modern systems Milter support included in their versions of Sendmail.

Please note that you need a UNIX or UNIX-like system with Perl and a C development environment to install MIMEDefang from source.
