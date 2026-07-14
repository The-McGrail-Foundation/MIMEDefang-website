Title: How do I scan for viruses using the async ClamAV interface?
Date: 2026-06-27 12:03:00
Category: snippets
Tags: Async
Num: 019
Status: published

Two async ClamAV variants are available, both used in `filter_end`:

- `md_async_message_contains_virus_clamd` - sends a `SCAN` command directly to
  the clamd socket.  Fastest, but clamd must run on the same host as MIMEDefang
  and be able to open the spool path itself.
- `md_async_message_contains_virus_clamdscan` - spawns `clamdscan --stream`,
  streaming file data over the INSTREAM protocol.  Works with both local
  Unix-socket clamd and remote TCP clamd.

Both return the standard triplet `($code, $category, $action)`.

    use Mail::MIMEDefang::Async;

    sub filter_end {
        my($entity) = @_;

        # Option A: direct clamd socket (local clamd only)
        my ($code, $category, $action) =
            md_async_message_contains_virus_clamd('/var/run/clamav/clamd.sock');

        # Option B: clamdscan --stream (local or remote clamd)
        # my ($code, $category, $action) =
        #     md_async_message_contains_virus_clamdscan('/etc/clamav/clamd.conf');

        if ($code == 1 && $category eq 'virus') {
            md_syslog('Warning',
                "Virus detected in message from $sender ($RelayAddr): $category");
            md_graphdefang_log('virus', $category, $RelayAddr);
            return action_bounce("Message rejected: virus detected ($category)");
        }

        if ($code == 999) {
            md_syslog('Warning',
                "ClamAV error for message from $sender: $category");
            return action_tempfail("Temporary error during virus scan, please retry");
        }
    }
