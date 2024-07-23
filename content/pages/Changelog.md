Title: MIMEDefang - Changelog
Date: 2024-07-23 17:30:45
Author: gbechis
Slug: documentation/Changelog
Status: published
Template: documentation

## Changelog

New features and fixes of MIMEDefang versions.

**MIMEDefang 3.4** 2023-04-16

   * add a mimedefang-release program to release a message from
     quarantine directory

   * add email_is_blacklisted to check an email address against an
     hashbl rbl server

   * UTF-8 support improvements

   * Authentication-Results header improvements


**MIMEDefang 3.3** 2023-01-16

   * add UTF-8 support to md_graphdefang_log

   * add a gen_mx_id Perl implementation, needed for OpenSMTPd support

**MIMEDefang 3.2** 2022-10-21

   *  make graphdefang compatible with current php versions

**MIMEDefang 3.1** 2022-08-24

   * make more subs public

   * make md_authres headers parsable by Mail::DKIM <= 0.54

**MIMEDefang 3.0** 2022-06-15

   * add is_public_ip6_address to check if an ipv6 address
     is local

   * add md_authres method to generate a basic Authentication-Results
     header for the message

   * add md_arc_sign method to sign email messages
     with DKIM ARC signatures

   * add md_dkim_verify method to verify DKIM signatures

   * add md_dkim_sign method to sign email messages
     with DKIM signatures

   * add anonymize_uri to remove utm_* parameters
     from uris.

   * use new Rspamd connection method by default

   * switch to Digest::SHA

   * split mimedefang.pl code in Perl modules

   * add re_match_in_7zip_directory to check for files
     inside 7zip archives

**MIMEDefang 2.86** 2021-12-17

   * Rspamd support by forking rspamc(1) binary
     is now deprecated, added Rspamd support by implementing
     its protocol

   * fallback to plaintext when md_check_against_smtp_server
     fails SSL connection for unknown reasons

**MIMEDefang 2.85** 2021-08-25

   * add experimental support to scan emails with Rspamd antispam

   * remove --enable_cleanup_with_rm "configure" parameter,
	 switch to non reentrant version of readdir(3)

   * Obtain the Queue-ID as early as possible in the SMTP
	 session. Requires the "-y" command-line option to mimedefang.

   * Add support for USE_SETSYMLIST in the system unit and Red Hat
  	 init script; setting USE_SETSYMLIST=yes adds the "-y" command-line
	 option to mimedefang.

   * mimedefang.pl: Add support for a configuration file
	 to separate data from code

   * mimedefang.pl: Add support to scan messages for viruses on a remote
	 Clamav server using clamdscan client.

   * mimedefang.pl: Add re_match_in_rar_directory function to match
	 unwanted file names extensions inside a rar archive file.

   * mimedefang.pl: Added TLS support to md_check_against_smtp_server

**MIMEDefang 2.84** 2018-03-21

	* mimedefang.pl: Correctly use "$mon" rather than "$min" to generate
	quarantine file names.

	* mimedefang-multiplexor: Make "workerinfo nnn" show how long ago
	the last state change was for a given worker.

**MIMEDefang 2.83** 2017-10-30

	* mimedefang.pl: Do not add a Message-ID: header when handing a
	message to SpamAssassin if the original message lacks such a
	header.

	* Add systemd unit files; thanks to Richard Laager.

	* Minor tweaks to the sample filter.

	* mimedefang-multiplexor: Change the maxLifetime option to kick in
	only once a worker has processed at least one request; also check
	for exceeded lifetimes during the periodic idle-time check.

	* mimedefang-multiplexor: Fix an exit(EXIT_FAILURE) to be
	exit(EXIT_SUCCESS) in on place.

**MIMEDefang 2.82** 2017-09-08

	* Update contrib/graphdefang with improvements from Kevin A. McGrail.

	* Fix Red Hat init script (thanks to Robert Scheck)

	* Exit with EXIT_SUCCESS if mimedefang-multiplexor is told to
	terminate.

	* Terminology change:  Change "slave" to "worker" everywhere.

	*** NOTE INCOMPATIBILITY ***

	Check your init scripts to make sure they use current names for shell
	variables; a few "SLAVE" strings have been changed to "WORKER"

	* Add a new -V maxLifetime option to mimedefang-multiplexor that
	terminates worker processes after maxLifetime seconds (approximately).
	This is in addition to the -r maxRequests option.

	* Log the lifetime and number of requests processed when we terminate
	a worker process.

**MIMEDefang 2.81** 2017-08-31

	* Don't barf if the installed version of Sys::Syslog has a developer
	tag added (like 0.33_01 on Debian Stretch).

	* Make mimedefang and mimedefang-multiplexor write their PID files
	as root to avoid an unprivileged user tampering with the pidfiles.
	Thanks to Michael Orlitzky for pointing this issue out.

	*** NOTE INCOMPATIBILITY ***

	You should move your PID files out of the MIMEDefang spool directory
	and into a standard root-owned directory like /var/run.  Use the -o
	option to create lock files in the spool directory.  The sample
	init scripts have been updated to reflect this.

**MIMEDefang 2.80** 2017-07-24

	* md-mx-ctrl: Add newline to mimedefang-multiplexor output that lacks
	a newline.

	* mimedefang-util: Properly substitute @PERL@ at configure time.

	* mimedefang-multiplexor.c: Move variable declarations to start of
	compound statement to avoid problems with older C compilers.

	* mimedefang.pl: Add an extra level of subdirectories in the quarantine
	to avoid 32K subdirectory limit on ext3.  Idea by Kevin McGrail.

	*** NOTE INCOMPATIBILITY ***  Quarantine subdirectory naming changed.

	* mimedefang.c: Fix bug that caused Queue-ID not to show up when
	using MIMEDefang with Postfix (thanks to Kris Deugau).

**MIMEDefang 2.79** 2016-09-26

	* Add the --data-dump option to scripts/mimedefang-util

	* Improve Postfix compatibility by trying to get QueueID after first
	RCPT command, and if not found, at the EOH milter phase.

	* Make mimedefang-multiplexor exit with a successful return code upon
	receipt of SIGTERM.

	* Use 64-bit variables where supported for some statstics counters that
	could overflow with only 32-bit variables, yielding incorrect statistics.
	* Fix configure.in to correctly detect that an embedded Perl interpreter
	can be destroyed/recreated on systems that need the -pthread GCC flag.

**MIMEDefang 2.78** 2015-04-23

	* Fix bug in logic that coalesces multiparts to single-parts if
	  possible; the bug broke DKIM signing.  Fix is courtesy of
	  Peter Nagel.

**MIMEDefang 2.77** 2015-04-20

	* Change old author's name to "Dianne Skoll" in many places.

**MIMEDefang 2.76** 2015-03-27

	* mimedefang.pl.in: Get rid of all Perl function prototypes.
	  Perl prototypes are badly-implemented and consensus among
	  modern Perl 5 programmers is they shouldn't be used.
	  https://www.securecoding.cert.org/confluence/display/perl/DCL00-PL.+Do+not+use+subroutine+prototypes

	* Add support for filter_wrapup callback.  This is called at the
	  very end and permits header modifications, but not body
	  modifications.  Useful for DKIM-signing.

	* mimedefang.pl.in: Fix typo: SOPHOS should have been SAVSCAN

	* mimedefang.c: Don't add a MIME-Version header if there is already
	  one.

	* Fix https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=646347
	  courtesy of Chrisoph Martin

	* Minor clarifications to mimedefang-filter man page.

	* Add "All / Summary" button to watch-multiple-mimedefangs.tcl

**MIMEDefang 2.75** 2014-05-21

	* Many cosmetic improvements to watch-multiple-mimedefangs.tcl

	* Fix md_get_bogus_mx_hosts so it checks A records iff a domain has
	  no MX records.

	* Add a forward declaration of rebuild_entity to avoid warnings on
	  recent Perl versions.

**MIMEDefang 2.74** 2013-05-27

	* Increase buffer size for md-mx-ctrl responses.

	* Close input file handle in append_to_html_part.  Bug found by
	Kees Theunissen.

	* Add action_add_entity function.

	* Simplify code in action_replace_with_warning.

	* Remove obsolete text from man page.

	* Avoid deprecated "defined(@array)" construct.

	* Implement new "load1" md-mx-ctrl command which gives statistics
	in more useful format than "load"

	* get_mx_ip_addresses: Treat MX records of '', '.', '0', '0.', '0
	.' and '0 ' as bogus.

	* watch-multiple-mimedefangs.tcl: Major improvements; see the
	new -n, -r, -s and -t command-line options.

	* Add rcpt_addr, rcpt_host and rcpt_mailer to default set of
	macros that we ask for.

	* Log Sendmail queue ID in more places.

	* Remove dead "connect_to_socket" routine in mimedefang.pl

	* Do not invokve smfi_setsymlist unless "-y" option to
	mimedefang is given.  smfi_setsymlist leaks memory in versions
	of Sendmail prior to 8.14.4.

**MIMEDefang 2.73** 2012-01-23

	* Create /var/spool/MIMEDefang with mode 0750 by default.

	* Make the -G option cause files created by mimedefang to
	be group-readable.  Add the new MD_ALLOW_GROUP_ACCESS init script
	variable.

	* Make the multiplexor snoop in on communications and save the
	Sendmail queue-ID for logging purposes.  It logs the queue ID when
	logging a worker's STDERR.

	* Make configure.in check whether or not libmilter requires -lldap.

	* Fix Graphdefang to handle new md_syslog output style.

	* Always check return code from chdir() in mimedefang.pl.  In
	certain cases on large and heavily-loaded servers, if the chdir()
	failed MIMEDefang would end up working in the wrong directory with
	attendant chaos.

	* Add "-G" option to mimedefang and mimedefang-multiplexor.  This
	makes their sockets group-readable and group-writable.

	* Pass along the client port number, server IP address and server port
	number to all filter functions.  This feature was sponsored by Scayl.

**MIMEDefang 2.72** 2011-07-20

	* The "make unstripped" target has disappeared.  Instead,
	use:  make INSTALL_STRIP_FLAG=''

	* The RPM_INSTALL_ROOT make variable has disappeared.  Instead,
	use the standard DESTDIR:  make install DESTDIR=/some/dir

	* In mimedefang.c, truncate overlong responses from the multiplexor.
	Also sanitize replies so "\r" doesn't get fed to smfi_setmlreply.

	* If a worker process replies with a very long reply, have the
	multiplexor consume (and discard) the excess input so the
	multiplexor-to-worker protocol does not become de-synchronized.

	* When mimedefang becomes a daemon, have it wait for a
	"go/no-go" message from the child before exiting.  This should
	eliminate race conditions whereby the MTA starts before the
	milter socket is present.

	* Revert change in 2.72-BETA-1 that passed client port number.
	It was a hack; we need a proper way to pass largish amounts of
	information to the filter and that will have to wait for a major
	reworking of MIMEDefang.

	* Avoid run-time errors from Unix::Syslog on some platforms.

	* Change md_syslog to log the Sendmail Queue-ID if it is
	available.

	* Pass SMTP client port number to filter_relay, filter_helo,
	filter_sender and filter_recipient.  Also make it available
	to filter_begin/filter/filter_end in $RelayPort global variable.

	* Remove references to ParanoidFiler.

**MIMEDefang 2.71** 2010-08-18

	* More spelunking in the awful innards of Perl reveals that our
	original fix in 2.70 for handling of $SIG{FOO}... didn't
	completely fix the problem.  On systems where Perl was compiled to
	use threading, running "md-mx-ctrl reread" could result in
	subsequent failure by scanners to set signal dispositions.  This
	has been fixed.

	* Fix typo in examples/init-script.in

	* Fix compatibility with Postfix (broken in 2.70.)

**MIMEDefang 2.70** 2010-06-24

	* Fixed a bug in embedded Perl: We have to call
	PERL_SET_CONTEXT after forking or Perl gets confused.
	In particular, setting signal-handling dispositions using
	$SIG{FOO} = sub { ... } breaks.

**MIMEDefang 2.69** 2010-06-16

	* Clarify wording of mimedefang-filter man page.

	* Remove obsolete code that used to attempt to generate working
	directory names.  Deactivate the no-longer-needed "-M" mimedefang
	option.

	* Makefile.in: "make install" target obeys only DESTDIR and now ignores RPM_INSTALL_ROOT

	* Add new "-y" option to mimedefang-multiplexor.  This limits
	the number of concurrent "recipok" commands on a per-domain basis.

	* Remove Anomy::HTMLCleaner support.

	* use MIME::Parser::Filer's ignore_filename() call instead of
	subclassing to override evil_filename().  Same effect, less code.

	* refactor resend_message_one_recipient() to use
	resend_message_specifying_mode() instead of reimplementing it.

	* header_timezone() now generates a strictly RFC2822-compliant timezone
	string without needing POSIX::strftime()

	* Ensure that decode_mimewords() is called in scalar context.

**MIMEDefang 2.68** 2010-02-24

	* The functions add_recipient, change_sender, delete_recipient,
	action_add_header and action_insert_header can be called from
	outside message context (that is, from filter_sender and
	filter_recipient).  Based on suggestion from D. Stussy.

	* Detect Sys::Syslog vs. Unix::Syslog at run-time rather than
	when running ./configure.

	* Fix a crash with embedded Perl on FreeBSD with Perl 5.10.0.
	Problem noted by Martin Blapp.

	* Bug fix: Don't change Content-Disposition to "inline" by default.
	This was causing weird bugs with Outlook iCalendar attachments:

	http://lists.roaringpenguin.com/pipermail/mimedefang/2006-December/031525.html
	http://lists.roaringpenguin.com/pipermail/mimedefang/2004-November/025461.html

	* Fix a really stupid segmentation fault when handling multiline
	replies.  Bug found and fixed by Michiel Brandenburg.

	* Make relay_is_blacklisted and relay_is_blacklisted_multi handle
	IPv6 addresses.  Patch loosely based on submission by Michiel
	Brandenburg.  NOTE: relay_is_blacklisted_multi and relay_is_blacklisted
	are DEPRECATED.  Use the CPAN module Net::DNSBL::Client instead.

	* Guard the rewriting of IPv4-compatible IPv6 addresses to plain IPv4
	with N6_IS_ADDR_V4MAPPED and IN6_IS_ADDR_V4COMPAT tests.

	* Work around File::Spec::Unix's behaviour of caching
	$ENV{TMPDIR}.  (I consider this a bug; see
	https://rt.cpan.org/Ticket/Display.html?id=53236)

	* Don't add a To: line for SpamAssassin's benefit; adding such
	a line could mask a useful SpamAssassin rule.

	* Try hard not to lose any STDERR messages before reaping a worker.

	* Make the C code call smfi_setmlreply if (1) the milter library
	supports it and (2) the Perl code returns a multi-line reply.

	* Convert an IPv6-mapped IPv4 address to pure IPv4.  That is,
	convert ::ffff:a.b.c.d simply to a.b.c.d.

	* Make rm_r more robust.

	* Set TMPDIR environment variable to $workdir/tmp before
	scanning; this should make Perl temporary files use the ramdisk.

	* Various code cleanups.

	* When creating the Mail::SpamAssassin object, set user_dir
	to /var/spool/MD-Quarantine.  Fixes problems with SpamAssassin
	3.3.0.

	* Make "Overlong line in RESULTS file" a permanent, rather than
	temporary, failure.

	* Eliminate a possible race condition in SIGTERM handling.  On
	busy, underpowered servers, this could result in the multiplexor
	spontaneously terminating all workers and unlinking its socket.

	* Check for both POLLIN and POLLHUP if we use poll()

	* Fix bug in closing of file descriptors after forking; we'd
	sometimes close our status descriptor by mistake.

	* Remove some pointless fcntl() calls.

	* Fix bug with Perl 5.10 and embedded perl, mentioned at
	http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=516913
	NOTE: This is a bug in Perl, not MIMEDefang, but we need to work
	around it.

	* Consume and log any STDERR output even if worker has terminated.

**MIMEDefang 2.67** 2009-01-06

	* Added support for FPROTD version 6 daemonized scanner.

**MIMEDefang 2.66** 2008-10-31

	* Added the option to use poll(2) instead of select(2) in
	mimedefang-multiplexor.  Use the --enable-poll ./configure option.
	This will eliminate problems with file descriptors > 1023 on
	many systems.  Thanks to Concordia University for sponsoring this
	development.

**MIMEDefang 2.65** 2008-02-02

	* Fix a few minor compiler warnings

	* embperl.c, configure.in: Fix problems with embedded Perl on
	Debian HPPA architecture.

	http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=486069

**MIMEDefang 2.64** 2008-01-24

	* Fix typo in the generic init-script.in file.  Also, on
	FreeBSD/NetBSD, generic init-script.in fits into the *BSD init
	structure natively.

	* watch-multiple-mimedefangs.tcl: Works better with Tcl/Tk 8.5.
	Displays message volumes/day in more human-readable form.  New
	-archive option logs statistics to files.

	* Add support for NOD32 command-line scanner (Dusan Zovinec)

	* Add support for Sophos "savscan" scanner (Adam Lanier)

	* embperl.c: Fix Perl's $$ variable so it reflects the actual PID
	of the worker process.  If you are using Embedded Perl, this should
	remove a major source of irritation (log messages previously used
	the PID of the master multiplexor process.)

	*  mimedefang.pl.in: Make md_check_against_smtp_server include the
	Sendmail Queue-ID in the syslog message.

	* mimedefang.c: If mail is submitted via a UNIX-domain socket
	(yes, this is possible, apparently!) consider the sending relay
	to be 127.0.0.1.  Fixes Debian bug #439432

	* mimedefang-filter.5.in: Minor clarifications

	* redhat/mimedefang-init.in: Minor fixes

	* examples/init-script.in: Minor fixes

**MIMEDefang 2.63** 2007-08-13

	* mimedefang-multiplexor.c: Relax the umask when creating the
	unprivileged socket ("-a" command-line option.)

	*  mimedefang.c(eom): If we do not have a queue ID yet, try to
	obtain one in eom.  This is designed to improve operation with
	Postfix, which does not assign a queue ID until after the first
	successful RCPT.  Based on a patch from Henrik Krohns.

	*  examples/init-script.in: Added MD_SKIP_BAD_RCPTS init
	script option (suggested by John Nemeth)

	* Remove support for OpenAntivirus.  It's a dead product.

	* mimedefang.pl.in(spam_assassin_status): Call $mail->finish()
	to prevent temporary files from accumulating.

	* redhat/mimedefang-init.in: Add configtest routine to check filter
	syntax.

**MIMEDefang 2.62** 2007-04-10

	* milter_cap.c: Minor code cleanups.

	* You can invoke mimedefang like this:   mimedefang prcap
	and it prints details about the version of libmilter it's linked
	with and exit.

	* mimedefang.pl.in: A new "change_sender" action lets you change
	the envelope sender.  Only works with Sendmail/Milter 8.14.0 and
	newer!

	* mimedefang.c: A new "-N" flag causes Sendmail not to make
	filter_recipient callbacks for invalid recipients.  Only works
	with Sendmail/Milter 8.14.0!  Note that without the -N flag,
	MIMEDefang now works the same with 8.14.0 and 8.13.x -- you always
	see all recipients by default, even invalid ones.

	* mimedefang.pl.in: Clam interface code has been fixed to work
	properly with ClamAV 0.90 and later.

	* redhat/mimedefang-init.in: Understand MX_TICK_REQUEST and
	MX_TICK_PARALLEL variables which get translated into -X and -P
	mimedefang-multiplexor options, respectively.

**MIMEDefang 2.61** 2007-02-09

	* SECURITY FIX: Versions 2.59 and 2.60 contained a programming
	error that could lead to a buffer overflow.  This is definitely
	exploitable as a denial-of-service attack, and potentially may
	allow arbitrary code execution.  The bug is fixed in 2.61.

	* mimedefang.c: If a message is going to end up being rejected,
	discarded or tempfailed, we don't bother carrying out requests
	to add/delete/modify headers or recipients, change the message
	body, etc.

**MIMEDefang 2.60** 2007-02-02

	* mimedefang.c: Fix filter registration so MIMEDefang works
	correctly against libmilter from Sendmail 8.14

	* Fix a number of "pointer differs in signedness" warnings.
	(Problem noted by Ashley Kirchner.)

**MIMEDefang 2.59** 2007-01-20

	* watch-multiple-mimedefangs: Add grid-lines; tweak GUI a bit.

	* configure.in and Makefile.in: Instead of explicitly linking
	against limilter.a, just supply the -lmilter link option.  This
	means it should work properly on 64-bit systems that keep their
	libraries in /usr/lib64.  It also means that if you have a
	libmilter.so lying around, we'll link against it instead of linking
	statically.

	* configure.in: Require only 0.15 of Sys::Syslog to check for
	setlogsock('native').  (Matt Selsky)

	* mimedefang.c: Major changes: We build up the contents of
	COMMANDS in memory and write it out in one big chunk per milter
	callback.  Not only does this reduce the number of system calls,
	but we also now _check the return code_ of those calls!

	* mimedefang.pl.in(item_contains_virus_fprotd): More careful inspection
	of F-PROT output to determine virus name.  (Jan-Pieter Cornet)

	* Added a new tool (watch-multiple-mimedefangs.tcl) for monitoring
	a cluster of MIMEDefang scanners

	* mimedefang.pl.in: (dmo) Change "use POSIX;" to "use POSIX ();"
	to save several hundred kilobytes of memory per worker.

	* mimedefang.pl.in: (dmo) Remove useless "use Getopt::Std;"

	* mimedefang.pl.in: (dmo) Some code refactoring.

	*  Modify multiplexor and mimedefang.pl.in so worker status updates
	work correctly (the -Z multiplexor flag.)  Previously, the worker
	status wasn't being reset correctly.

	*  Modify multiplexor so worker status changes are broadcast using
	the notification facility (-O multiplexor flag).  A new "S" message
	is used for worker status changes.

	*  mimedefang.pl.in(read_commands_file): If the COMMANDS file did not
	end with an F, the worker would give up and become idle, but not
	inform the multiplexor.  As a result, the multiplexor would think
	the worker was busy, and the worker would be unavailable until the
	busy timeout elapsed and it was killed by the multiplexor.  This
	bug has been fixed.

	*  redhat/mimedefang-spec.in: Changes as suggested by Philip
	Prindeville for cleaning up RPM builds and detecting proper
	libraries on x86-64 systems.

**MIMEDefang 2.58** 2006-11-07

	* Memory leak in mimedefang found and fixed.  If a client issues
	more than one MAIL command in a single SMTP session, then the
	milter used to leak approximately 16 bytes for each subsequent
	MAIL command.

	*  Running ./configure --enable-debugging includes much more debugging
	output, especially to diagnose memory allocation and deallocation.
	DO NOT USE ON A PRODUCTION SERVER.

	*  If we have Sys::Syslog 0.16 or higher, do not call setlogsock
	(which is deprecated).  Patch based on suggestion from Matt Selsky.

	*  Sample init script sets HOME=/var/spool/MIMEDefang.

	*  Sample filter for Windows clients tweaked slightly: We don't
	complain about non-multipart .eml attachments (was causing false
	positives.)

	*  Fixed typo in Red Hat sample init script.

	* mimedefang.pl.in: If SpamAssassin version >= 3.1.5, do not
	supply LOCAL_RULES_DIR or LOCAL_STATE_DIR in constructor.  Use
	defaults from Perl modules.

	*  examples/init-script.in: Add ALLOW_NEW_CONNECTIONS_TO_QUEUE
	config variable.

	*  mimedefang-multiplexor.c: Fix useless call to sigprocmask.
	(Used SIG_BLOCK; should have been SIG_SETMASK)

	*  mimedefang.c: Make sure that we're given the -p option.

	*  embperl.c: Remove warning about "Something in your filter has
	opened a file descriptor..." because there are way too many systems
	that trigger this warning, and they don't seem to have problems.

	*  Remove all support for the File::Scan module.

**MIMEDefang 2.57** 2006-06-19

	* suggested-minimum-filter-for-windows-clients: Explicitly set
	$entity variable in filter_begin.

	* mimedefang.pl.in: If clamdscan fails with zip module failure,
	attempt to use scanner in $Features{'Virus:CLAMAV'} rather than
	a hard-coded call to "clamscan"

	* Minor fixes to man pages.  Some cleanups courtesy of
	Brandon Hutchinson

	* mimedefang-multiplexor.c: New "md-mx-ctrl hload" command keeps track
	of load for past 1, 4, 12 and 24 hours.  Gives long-term data to
	complement the short-term "md-mx-ctrl load" data.

	* mimedefang-multiplexor: New scheduling algorithm tries to keep
	commands "sticky".  For example, when looking for a worker to run
	"recipok", we prefer to use a worker that recently ran "recipok".
	NOTE!!! If your filter incorrectly retains state from earlier
	callbacks into filter_begin, this scheduling change WILL expose
	the bugs in your filter.

	* mimedefang.c: Bug fix for NULL pointer dereference when running
	"sendmail -bs".  Problem noted by Leena Heino.

	* mimedefang.pl.in: Fix for FPROTD integration courtesy of
	Jonathan Hankins.

	* mimedefang.pl.in: Fix for H+BEDV integration courtesy of
	Thorsten Schlichting.

	* mimedefang.pl.in: Pass LOCAL_STATE_DIR => '/var/lib' to
	Mail::SpamAssassin constructor.  If your LOCAL_STATE_DIR
	is elsewhere, you'll have to hack the Perl code, I'm afraid.

**MIMEDefang 2.56** 2006-02-13

	* Remove spam_assassin_init()->compile_now(1) call from sample filter.

	* mimedefang-multiplexor.c: Fix off-by-one error that could result
	in a worker thinking that the global generation counter had
	changed, causing the worker to restart unnecessarily.

	* redhat/mimedefang-init.in: Add support for MX_HELO_CHECK
	configuration variable.

	* mimedefang.c: Fix compilation problem on some systems.

	* mimedefang.pl.in: entity_contains_virus_nai,
	message_contains_virus_nai: Add the --mime option when invoking
	uvscan.

	* mimedefang.pl.in: message_contains_virus_clamd: Use more reasonable
	timeouts when talking to clamd.

**Changelog** for older [versions](https://raw.githubusercontent.com/The-McGrail-Foundation/MIMEDefang/master/Changelog)
