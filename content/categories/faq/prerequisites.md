Title: What are the prerequisites for installing MIMEDefang?
Date: 2021-07-14 18:40:30
Category: faq
Num: 001
Status: published

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
