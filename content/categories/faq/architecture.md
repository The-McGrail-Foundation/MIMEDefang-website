Title: What is the architecture of MIMEDefang?
Date: 2023-12-01 10:30:15
Category: faq
Num: 003
Status: published

The MIMEDefang system consists of three main programs:

-   mimedefang is a C “Milter” program. It talks directly to Sendmail using the multi-threaded Milter library.
-   mimedefang-multiplexor is a C program that accepts requests from mimedefang and forwards them to one of a pool of slave Perl processes.
-   mimedefang.pl is a Perl program that does the actual mail filtering. The multiplexor manages a pool of these processes, forwarding idle processes work and reading the results.

A complete description of the architecture may be found in the PDF [presentation slides](https://mimedefang.org/static/mimedefang-mcgrail.pdf).
