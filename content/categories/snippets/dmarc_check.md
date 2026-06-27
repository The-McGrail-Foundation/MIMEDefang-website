Title: How can I retrieve and act on DMARC records?
Date: 2026-06-27 10:09:00
Category: snippets
Tags: Authentication
Num: 015
Status: published

DMARC record lookups are best done in `filter_begin` so the policy is available for
downstream checks (e.g. BIMI verification or per-policy actions).
`md_get_dmarc_record` returns a string with the raw DMARC TXT record, or `undef`
if no record exists.

    use Mail::MIMEDefang::Net;

    sub filter_begin {
        my($entity) = @_;

        my $from_domain = $sender;
        $from_domain =~ s/^.*\@//;

        my $dmarc_record = md_get_dmarc_record($from_domain);

        unless (defined $dmarc_record) {
            md_syslog('Info', "No DMARC record found for $from_domain");
            return;
        }

        md_syslog('Info', "DMARC record for $from_domain: $dmarc_record");

        # Parse the policy tag from the record
        my ($policy) = ($dmarc_record =~ /\bp=(\w+)/i);
        $policy //= 'none';

        md_syslog('Info', "DMARC policy for $from_domain: $policy");

        if ($policy eq 'reject') {
            # Domain publishes p=reject — be stricter on authentication failures
            action_change_header('X-DMARC-Policy', "reject ($from_domain)");
        } elsif ($policy eq 'quarantine') {
            action_change_header('X-DMARC-Policy', "quarantine ($from_domain)");
        } else {
            action_change_header('X-DMARC-Policy', "none ($from_domain)");
        }
    }
