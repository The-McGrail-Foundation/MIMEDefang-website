Title: How do I initialise the async engine?
Date: 2026-06-27 12:00:00
Category: snippets
Tags: Async
Num: 016
Status: published

Call `md_async_init` once at package scope (outside any sub), after the `use`
statements at the top of your filter file.  It sets up the AnyEvent event loop
that all async checks share.  Requires the optional CPAN modules **AnyEvent**,
**AnyEvent::DNS**, **AnyEvent::Socket**, and **AnyEvent::Util**.

    use Mail::MIMEDefang::Async;
    use Mail::MIMEDefang::Async::Checks qw(
        md_async_check_dnsbl
        md_async_check_rdns
        md_async_check_spf_record
        md_async_check_dmarc_record
        md_async_check_mx_exists
    );
    use Mail::MIMEDefang::Async::Results qw(
        md_async_interpret_dnsbl
        md_async_interpret_rdns
        md_async_interpret_spf_txt
        md_async_interpret_dmarc
        md_async_score_results
    );

    md_async_init(
        max_concurrency => 8,   # max parallel checks in flight
        global_timeout  => 10,  # hard wall-clock limit for the whole batch (seconds)
        dns_timeout     => 5,   # per-DNS-query timeout (seconds)
        socket_timeout  => 5,   # per-socket-connection timeout (seconds)
    );

These settings apply to every call to `md_async_run_checks()` in the filter.
Tune `global_timeout` to stay within your MTA's milter socket timeout.
