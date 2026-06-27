Title: Mail::MIMEDefang::Async::Results(3) - man page
Description: Mail::MIMEDefang::Async::Results translates raw output from md_async_run_checks() into actionable filter decisions.
Author: gbechis
Slug: man_Mail::MIMEDefang::Async::Results
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Async::Results - Interpret async check output for MIMEDefang

# DESCRIPTION

Mail::MIMEDefang::Async::Results translates raw output from
`md_async_run_checks()` into actionable filter decisions (reject, tempfail,
score, pass).

# SYNOPSIS

    use Mail::MIMEDefang::Async::Results;

    my $dnsbl = md_async_interpret_dnsbl(
        records => $result->{results}{zen},
        zone    => 'zen.spamhaus.org',
        error   => $result->{errors}{zen},
    );

    my $score = md_async_score_results(
        interpreted => { zen => $dnsbl },
        reject_at   => 5.0,
    );

    if ($score->{action} eq 'REJECT') {
        return action_bounce("550 5.7.1 " . $score->{reasons}[0]);
    }

# METHODS

- md\_async\_interpret\_dnsbl(%args)

    Interpret a DNSBL result.  Args: `records` (arrayref or undef), `zone`,
    `error`.  Returns a hashref with keys `listed`, `code`, `reason`,
    and optionally `error`.

- md\_async\_interpret\_spamassassin(%args)

    Parse a raw SPAMC protocol response. Args: `raw`, `error`,
    `threshold` (default 5.0). Returns `is_spam`, `score`, `threshold`,
    `symbols`, `reason`.

- md\_async\_interpret\_clamav(%args)

    Interpret a clamd PING or INSTREAM response. Args: `raw`, `error`.
    Returns `available`, `virus`, `name`, `reason`.

- md\_async\_interpret\_rdns(%args)

    Interpret a PTR record result.  Args: `records`, `error`, `ip`.
    Returns `has_rdns`, `ptr`, `dynamic`, `reason`.

- md\_async\_interpret\_spf\_txt(%args)

    Check whether a TXT record lookup returned an SPF record.  Args: `records`,
    `error`, `domain`.  Returns `has_spf`, `record`, `reason`.

- md\_async\_interpret\_dmarc($raw)

    Parse a raw DMARC TXT policy string (as returned by
    `md_async_dmarc_verify()` or from the `records` of
    `md_async_check_dmarc_record()`).

    Returns a hashref with keys: `has_dmarc`, `policy`, `subdomain_policy`,
    `pct`, `rua`, `ruf`, `adkim`, `aspf`, `reason`.

- md\_async\_score\_results(%args)

    Tally individual interpreted check results into a weighted spam score.
    Args: `interpreted` (hashref of name->interp result), `weights` (optional
    override), `reject_at` (default 8.0), `tempfail_at` (default 12.0).

    Returns `{ score, action, reasons }` where `action` is one of
    `'PASS'`, `'REJECT'`, `'TEMPFAIL'`.

# SEE ALSO

[Mail::MIMEDefang::Async](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync), [Mail::MIMEDefang::Async::Checks](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync%3A%3AChecks)
