Title: How do I check for spam using the async SpamAssassin and Rspamd interfaces?
Date: 2026-06-27 12:04:00
Category: snippets
Tags: Async
Num: 020
Status: published

Two async spam-checking variants are available, both used in `filter_end`:

- `md_async_spamc_check` - sends the message to spamd using the raw SPAMC wire
  protocol over an async socket.  Does not require `Mail::SpamAssassin::Client`.
- `md_async_rspamd_check` - POSTs the message to the Rspamd HTTP API over an
  async TCP socket.  Does not require `LWP::UserAgent`.
- `md_async_spam_assassin_check` - runs SpamAssassin in-process (no spamd),
  reading `./INPUTMSG`.  Use when spamd is not available.

Each returns the same values as its synchronous counterpart.

    use Mail::MIMEDefang::Async;

    sub filter_end {
        my($entity) = @_;

        # --- Option A: async spamc (needs a running spamd) ---
        my ($score, $threshold, $report, $isspam) = md_async_spamc_check(
            host    => '127.0.0.1',
            port    => 783,
            user    => 'defang',
            timeout => 30,
        );

        if (defined $score) {
            action_change_header('X-Spam-Flag',  $isspam  ? 'YES' : 'NO');
            action_change_header('X-Spam-Score', "$score / $threshold");
            if ($isspam && $score >= 10) {
                return action_bounce("Message rejected as spam (score $score)");
            }
        }

        # --- Option B: async Rspamd ---
        my ($hits, $req, $tests, $rpt, $action, $is_spam) =
            md_async_rspamd_check('http://127.0.0.1:11333');

        md_syslog('Info',
            "Rspamd: score=$hits/$req action=$action spam=$is_spam tests=$tests");

        if ($action eq 'reject') {
            return action_bounce("Message rejected by Rspamd (score $hits)");
        }
        if ($action eq 'add header' || $is_spam eq 'true') {
            action_change_header('X-Spam-Score', "$hits/$req $tests");
        }

        # --- Option C: in-process SpamAssassin (no spamd required) ---
        # my ($hits, $required, $names, $full_report) =
        #     md_async_spam_assassin_check();
    }
