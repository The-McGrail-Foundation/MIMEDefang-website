Title: How can I check SPF records for incoming mail?
Date: 2026-06-27 10:01:00
Category: snippets
Tags: Authentication
Num: 007
Status: published

SPF verification should be done in `filter_begin`, before the message body is processed.
The check uses the sender address, relay IP, and optional HELO name.

    use Mail::MIMEDefang::SPF;

    sub filter_begin {
        my($entity) = @_;

        my ($spf_result, $spf_explanation,
            $helo_result, $helo_explanation) =
                md_spf_verify($sender, $RelayAddr, $Helo);

        md_syslog('Info', "SPF result for $sender: $spf_result ($spf_explanation)");

        if ($spf_result eq 'fail') {
            # Hard SPF fail - reject the message
            return action_bounce("SPF check failed: $spf_explanation");
        }

        if ($spf_result eq 'softfail') {
            # Soft fail - tag but do not reject
            action_change_header('X-SPF-Result', "softfail ($spf_explanation)");
        }

        if ($spf_result eq 'pass') {
            action_change_header('X-SPF-Result', 'pass');
        }
    }
