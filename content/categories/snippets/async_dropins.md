Title: How do I use async drop-in replacements for common checks?
Date: 2026-06-27 12:01:00
Category: snippets
Tags: Async
Num: 017
Status: published

`Mail::MIMEDefang::Async` provides async drop-in replacements for the most
common blocking network calls.  After calling `md_async_init` at package
scope, you can swap these in place of their synchronous counterparts in
`filter_begin` or `filter_sender` with no other changes to your filter logic.

    use Mail::MIMEDefang::Async;

    sub filter_begin {
        my($entity) = @_;

        # Drop-in for relay_is_blacklisted() from Mail::MIMEDefang::Net
        my $listed = md_async_relay_is_blacklisted($RelayAddr, 'zen.spamhaus.org');
        if ($listed) {
            md_syslog('Warning', "Relay $RelayAddr listed in zen.spamhaus.org");
            return action_bounce("Mail rejected: $RelayAddr is blacklisted");
        }

        # Drop-in for md_spf_verify() from Mail::MIMEDefang::SPF
        my ($spf_result, $spf_exp) = md_async_spf_verify($sender, $RelayAddr, $Helo);
        if ($spf_result eq 'fail') {
            return action_bounce("SPF check failed: $spf_exp");
        }

        # Drop-in for md_get_dmarc_record() from Mail::MIMEDefang::Net
        my $from_domain = $sender;
        $from_domain =~ s/^.*\@//;
        my $dmarc_raw = md_async_dmarc_verify($from_domain);
        if (defined $dmarc_raw) {
            my ($policy) = ($dmarc_raw =~ /\bp=(\w+)/i);
            md_syslog('Info', "DMARC policy for $from_domain: " . ($policy // 'none'));
        }
    }

    sub filter_end {
        my($entity) = @_;

        # Drop-in for md_spamc_check() from Mail::MIMEDefang::Antispam (needs spamd)
        my ($score, $threshold, $report, $isspam) = md_async_spamc_check(
            host => '127.0.0.1',
            port => 783,
        );
        if (defined $score && $isspam) {
            action_change_header('X-Spam-Flag',  'YES');
            action_change_header('X-Spam-Score', "$score / $threshold");
        }

        # Drop-in for rspamd_check() from Mail::MIMEDefang::Antispam
        my ($hits, $req, $tests, $rpt, $action, $is_spam) = md_async_rspamd_check();
        md_syslog('Info', "Rspamd: action=$action spam=$is_spam score=$hits/$req");
    }
