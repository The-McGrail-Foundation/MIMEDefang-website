Title: Mail::MIMEDefang::Async(3) - man page
Description: Mail::MIMEDefang::Async provides concurrent DNS, socket-based, and process-based checks for use in MIMEDefang filter callbacks.
Author: gbechis
Slug: man_Mail::MIMEDefang::Async
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Async - Asynchronous I/O engine for MIMEDefang external checks

# DESCRIPTION

Mail::MIMEDefang::Async provides concurrent DNS, socket-based, and
process-based checks for use in MIMEDefang filter callbacks.  All checks
share a single AnyEvent event loop and the call blocks until every check has
completed or the global timeout fires.

Requires the optional modules **AnyEvent**, **AnyEvent::DNS**,
**AnyEvent::Socket**, and **AnyEvent::Util** from CPAN.

# METHODS

- md\_async\_init(%opts)

    Initialise the async engine.  Call once per process (e.g. at the top of your
    mimedefang-filter, after `use Mail::MIMEDefang::Async`).

    Options:

        max_concurrency  Max parallel checks in flight (default: 10)
        global_timeout   Hard wall-clock limit for the whole batch (default: 10s)
        dns_timeout      Per-DNS-query timeout (default: 5s)
        socket_timeout   Per-socket-connection timeout (default: 5s)

- md\_async\_run\_checks(\\@checks)

    Run a list of check descriptors concurrently. Blocks until all checks complete or
    the global timeout fires. Returns `{ results => \%r, errors => \%e }`.

    Each check is a hashref with `name`, `type` (`'dns'`, `'socket'`, or
    `'process'`), and `args`.  Use [Mail::MIMEDefang::Async::Checks](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync%3A%3AChecks) to build
    them.

- md\_async\_relay\_is\_blacklisted($addr, $zone)

    Async drop-in replacement for `relay_is_blacklisted` from
    [Mail::MIMEDefang::Net](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3ANet).

    Looks up `reverse_ip($addr).$zone` as a DNS A record. Returns the first
    matching IP string on a listing, `0` if not listed, or `undef` on
    error/timeout.

- md\_async\_email\_is\_blacklisted($email, $zone, $hash\_type)

    Async drop-in replacement for `email_is_blacklisted` from
    [Mail::MIMEDefang::Net](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3ANet).

    Hashes `$email` using **MD5** or **SHA1** (controlled by `$hash_type`), then
    looks up `$hash.$zone`. Returns the first matching IP string, `0` if not
    listed, or `undef` on error/timeout.

- md\_async\_spf\_verify($mail, $relayip, $helo)

    Async-enhanced replacement for `md_spf_verify` from [Mail::MIMEDefang::SPF](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3ASPF).

    Pre-fetches the sender domain's SPF TXT record via the async engine, then
    evaluates it using [Mail::SPF](https://metacpan.org/pod/Mail%3A%3ASPF) synchronously. Returns the same values as
    `md_spf_verify`. Returns `undef` immediately if `Mail::SPF` is not
    installed.

- md\_async\_dmarc\_verify($domain)

    Async replacement for `md_get_dmarc_record` from [Mail::MIMEDefang::Net](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3ANet).

    Performs an async TXT lookup on `_dmarc.$domain` and returns the raw DMARC
    policy string, or `undef` if none exists. Applies the same parent-domain
    fallback logic as the original.

- md\_async\_message\_contains\_virus\_clamd($clamd\_sock)

    Async replacement for `message_contains_virus_clamd` from
    [Mail::MIMEDefang::Antivirus](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAntivirus).

    Sends a `SCAN $CWD/Work` command to the clamd daemon over a socket and
    interprets the response. `$clamd_sock` may be a Unix socket path or a
    `host:port` string; defaults to `$ClamdSock`.

    **Note**: the `SCAN` command instructs clamd to open the path on its own
    filesystem. This only works when clamd runs on the same host as MIMEDefang.
    For remote clamd, use `md_async_message_contains_virus_clamdscan` instead.

    Returns the standard virus-scanner triplet `($code, $category, $action)`:

        (0,   'ok',             'ok')          clean
        (1,   'virus',          'quarantine')  virus found
        (999, 'cannot-execute', 'tempfail')    cannot connect
        (999, 'swerr',          'tempfail')    scan error

- md\_async\_message\_contains\_virus\_clamdscan($conf)

    Async replacement for `message_contains_virus_clamdscan` from
    [Mail::MIMEDefang::Antivirus](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAntivirus).

    Spawns `clamdscan --stream` which uses the `INSTREAM` wire protocol,
    streaming file data to clamd rather than asking it to open a local path.
    This makes it suitable for both a local Unix-socket clamd and a remote TCP
    clamd. `$conf` is the path to `clamd.conf`; defaults to
    `$Features{'Path:CLAMDCONF'}`. The socket clamd listens on (Unix or TCP)
    is determined by the `LocalSocket` / `TCPAddr` + `TCPSocket` directives in
    that config file.

    Returns the standard virus-scanner triplet `($code, $category, $action)`:

        (0,   'ok',             'ok')           clean
        (1,   'virus',          'quarantine')   virus found
        (1,   'not-installed',  'tempfail')     clamdscan binary not found
        (999, 'cannot-execute', 'tempfail')     could not spawn / timeout
        (999, 'swerr',          'tempfail')     scan error (clamdscan exit >= 2)

- md\_async\_spamc\_check(%args)

    Async replacement for `md_spamc_check` from [Mail::MIMEDefang::Antispam](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAntispam).

    Sends the message to spamd using the raw SPAMC wire protocol over an async
    socket, without requiring [Mail::SpamAssassin::Client](https://metacpan.org/pod/Mail%3A%3ASpamAssassin%3A%3AClient).

    Args: `host` (default `127.0.0.1`), `port` (default 783),
    `user` (default current user), `timeout` (default 30s).

    Returns the same four-element list as `md_spamc_check`:
    `($score, $threshold, $report, $isspam)`, or `undef` on failure.

- md\_async\_spam\_assassin\_check()

    Drop-in replacement for `spam_assassin_check` from
    [Mail::MIMEDefang::Antispam](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAntispam).

    Runs SpamAssassin in-process (no spamd required), reading `./INPUTMSG`.
    Returns the same four-element list: `($hits, $required_hits, $tests_list,
    $full_report)`, or `undef` when SpamAssassin is not installed or INPUTMSG
    cannot be read.

    For a network check against a running spamd, use `md_async_spamc_check`
    instead.

- md\_async\_rspamd\_check($uri)

    Async replacement for `rspamd_check` from [Mail::MIMEDefang::Antispam](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAntispam).

    POSTs the message to the Rspamd HTTP API at `$uri/checkv2` using a raw
    HTTP/1.0 request over an async TCP socket (no `LWP::UserAgent` required).
    Requires [JSON::PP](https://metacpan.org/pod/JSON%3A%3APP) (Perl core since 5.14) for response parsing.

    `$uri` defaults to `http://127.0.0.1:11333`.

    Returns the same six-element list as `rspamd_check`:
    `($hits, $required_score, $tests, $report, $action, $is_spam)`,
    or `(0, 0, '', '', 'soft reject', 'false')` on connection failure.

# SYNOPSIS

    use Mail::MIMEDefang::Async;
    use Mail::MIMEDefang::Async::Checks qw(...);
    use Mail::MIMEDefang::Async::Results qw(...);

    md_async_init(max_concurrency => 8, global_timeout => 10);

    my $result = md_async_run_checks([
        md_async_check_dnsbl(ip => $client_ip, zone => 'zen.spamhaus.org'),
        md_async_check_rdns(ip => $client_ip),
    ]);

    # Drop-in replacements
    my $listed                    = md_async_relay_is_blacklisted($client_ip, 'zen.spamhaus.org');
    my $dmarc                     = md_async_dmarc_verify($sender_domain);
    my ($code, $cat, $act)        = md_async_message_contains_virus();
    my ($score, $thr, $rep, $spam) = md_async_spamc_check();
    my ($hits, $req, $sym, $rpt, $action, $spam) = md_async_rspamd_check();

# SEE ALSO

[Mail::MIMEDefang::Async::Checks](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync%3A%3AChecks), [Mail::MIMEDefang::Async::Results](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync%3A%3AResults),
[Mail::MIMEDefang::Net](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3ANet), [Mail::MIMEDefang::SPF](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3ASPF)
