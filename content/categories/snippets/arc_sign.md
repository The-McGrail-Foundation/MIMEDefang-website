Title: How can I sign a message with ARC?
Date: 2026-06-27 10:00:00
Category: snippets
Tags: Authentication
Num: 006
Status: published

ARC (Authenticated Received Chain) signing should be done in `filter_end`, after all message processing is complete.
It preserves the authentication state of a message as it passes through intermediary mail servers.

    use Mail::MIMEDefang::DKIM::ARC;

    sub filter_end {
        my($entity) = @_;

        my $domain   = 'example.com';
        my $keyfile  = '/etc/mail/arc-private.key';
        my $selector = 'arc';

        my %arc_headers = md_arc_sign(
            $keyfile,      # path to private key
            'rsa-sha256',  # signing algorithm
            'ar',          # cv= value: 'ar' copies from Authentication-Results
            $domain,
            $domain,       # authserv-id (srvid), usually same as domain
            $selector,
        );

        if (exists $arc_headers{error}) {
            md_syslog('Warning', "ARC signing failed: $arc_headers{error}");
            return;
        }

        # Insert all ARC headers returned by md_arc_sign
        foreach my $hdr (sort keys %arc_headers) {
            action_insert_header($hdr, $arc_headers{$hdr});
        }
    }
