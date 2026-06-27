Title: How do I run multiple DNS checks in parallel with scoring?
Date: 2026-06-27 12:02:00
Category: snippets
Tags: Async
Num: 018
Status: published

`md_async_run_checks` fires all checks concurrently and blocks until every one
completes or the `global_timeout` fires.  Use `md_async_score_results` to
tally the interpreted results into a weighted spam score and get a single
`PASS` / `REJECT` / `TEMPFAIL` decision.  This belongs in `filter_begin`.

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

    sub filter_begin {
        my($entity) = @_;

        my $from_domain = $sender;
        $from_domain =~ s/^.*\@//;

        # All checks fire at once; wall-clock cost = slowest single check
        my $result = md_async_run_checks([
            md_async_check_dnsbl(name => 'zen',
                ip => $RelayAddr, zone => 'zen.spamhaus.org'),
            md_async_check_dnsbl(name => 'spamcop',
                ip => $RelayAddr, zone => 'bl.spamcop.net'),
            md_async_check_rdns(ip => $RelayAddr),
            md_async_check_spf_record(domain => $from_domain),
            md_async_check_dmarc_record(domain => $from_domain),
            md_async_check_mx_exists(domain => $from_domain),
        ]);

        my %interp = (
            zen     => md_async_interpret_dnsbl(
                records => $result->{results}{zen},
                zone    => 'zen.spamhaus.org',
                error   => $result->{errors}{zen}),
            spamcop => md_async_interpret_dnsbl(
                records => $result->{results}{spamcop},
                zone    => 'bl.spamcop.net',
                error   => $result->{errors}{spamcop}),
            rdns    => md_async_interpret_rdns(
                records => $result->{results}{rdns},
                error   => $result->{errors}{rdns},
                ip      => $RelayAddr),
            spf     => md_async_interpret_spf_txt(
                records => $result->{results}{spf},
                error   => $result->{errors}{spf},
                domain  => $from_domain),
            dmarc   => md_async_interpret_dmarc(
                $result->{results}{dmarc}),
        );

        my $score = md_async_score_results(
            interpreted => \%interp,
            reject_at   => 5.0,
            tempfail_at => 12.0,
        );

        md_syslog('Info',
            "Async batch score=$score->{score} action=$score->{action} "
            . "reasons=" . join(', ', @{$score->{reasons}}));

        if ($score->{action} eq 'REJECT') {
            return action_bounce("550 5.7.1 $score->{reasons}[0]");
        }
        if ($score->{action} eq 'TEMPFAIL') {
            return action_tempfail("451 4.7.1 Temporary check failure");
        }
    }
