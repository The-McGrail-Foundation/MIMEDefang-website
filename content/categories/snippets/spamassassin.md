Title: How can I use SpamAssassin to detect spam?
Date: 2026-06-27 10:05:00
Category: snippets
Tags: Antispam
Num: 011
Status: published

SpamAssassin scanning should be done in `filter_end`, after the full message is assembled.
`spam_assassin_check` returns hits, required threshold, triggered rule names, and a report.
Use `md_spamc_init` / `md_spamc_check` instead when using SpamAssassin 4.0.1+ in client mode.

    use Mail::MIMEDefang::Antispam;

    sub filter_end {
        my($entity) = @_;

        my ($hits, $required, $names, $report) = spam_assassin_check();

        md_syslog('Info', "SpamAssassin: score=$hits required=$required rules=$names");

        if ($hits >= $required) {
            # Tag the message as spam and add score header
            action_change_header('X-Spam-Flag',   'YES');
            action_change_header('X-Spam-Score',  "$hits / $required");
            action_change_header('X-Spam-Report', $names);
            md_graphdefang_log('spam', $hits, $RelayAddr);

            if ($hits >= 10) {
                # Reject very high-scoring messages outright
                return action_bounce("Message rejected as spam (score $hits)");
            }
        } else {
            action_change_header('X-Spam-Flag',  'NO');
            action_change_header('X-Spam-Score', "$hits / $required");
        }
    }
