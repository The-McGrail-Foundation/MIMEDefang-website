Title: How can I verify BIMI records for incoming mail?
Date: 2026-06-27 10:03:00
Category: snippets
Tags: Authentication
Num: 009
Status: published

BIMI (Brand Indicators for Message Identification) should be checked in `filter_begin`.
A BIMI record is only valid when the sending domain passes DMARC at enforcement level
(`p=quarantine` or `p=reject`). Install the optional `Mail::BIMI` Perl module for
full SVG logo and VMC certificate validation.

    use Mail::MIMEDefang::BIMI;

    sub filter_begin {
        my($entity) = @_;

        # Extract the From: domain
        my $from_domain = $sender;
        $from_domain =~ s/^.*\@//;

        # Check for a BIMI-Selector header and get the selector value
        my $selector = md_bimi_get_selector($entity);

        # These values should come from a prior DMARC check, e.g. via md_authres
        my $dmarc_result = 'pass';   # 'pass' or 'fail'
        my $dmarc_policy = 'reject'; # 'none', 'quarantine', or 'reject'

        my $bimi_result = md_bimi_verify(
            $from_domain,
            $dmarc_result,
            $dmarc_policy,
            $selector,
        );

        md_syslog('Info', "BIMI result for $from_domain (selector=$selector): $bimi_result");

        if ($bimi_result eq 'pass') {
            my $record = md_bimi_lookup($from_domain, $selector);
            if ($record) {
                action_add_header('BIMI-Indicator', $record->{l});
            }
        }
    }
