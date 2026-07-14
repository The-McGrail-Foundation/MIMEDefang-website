Title: How can I check if a relay is blacklisted (RBL)?
Date: 2026-06-27 10:07:00
Category: snippets
Tags: Antispam
Num: 013
Status: published

RBL (Real-time Blackhole List) checks should be done in `filter_begin` or `filter_sender`
to reject blocked senders as early as possible.
Use `relay_is_blacklisted` for a single RBL or `relay_is_blacklisted_multi_count`
to query several RBLs simultaneously and reject based on a hit count threshold.

    use Mail::MIMEDefang::Net;

    sub filter_begin {
        my($entity) = @_;

        # Single RBL check
        my $result = relay_is_blacklisted($RelayAddr, 'zen.spamhaus.org');
        if ($result) {
            md_syslog('Warning', "Relay $RelayAddr listed in zen.spamhaus.org ($result)");
            return action_bounce("Mail rejected: $RelayAddr is blacklisted");
        }

        # Multi-RBL check: reject if listed in 2 or more RBLs
        my @rbls = qw(zen.spamhaus.org bl.spamcop.net dnsbl.sorbs.net);
        my $hit_count = relay_is_blacklisted_multi_count($RelayAddr, @rbls);
        if ($hit_count >= 2) {
            md_syslog('Warning',
                "Relay $RelayAddr listed in $hit_count RBLs - rejecting");
            return action_bounce(
                "Mail rejected: sender IP listed in multiple blacklists");
        }
    }
