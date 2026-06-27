Title: How can I add an Authentication-Results header?
Date: 2026-06-27 10:04:00
Category: snippets
Tags: Authentication
Num: 010
Status: published

The `Authentication-Results` header consolidates SPF, DKIM, DMARC, and BIMI results
into a single header, making them available to downstream mail clients and filters.
Add it in `filter_begin` so it is present before the message body is processed.

When the optional `Mail::BIMI` module is installed and `$bimi_domain` is supplied,
`md_authres` will append a `bimi=pass` (or `bimi=fail`) result automatically.

    use Mail::MIMEDefang::Authres;

    sub filter_begin {
        my($entity) = @_;

        # Extract the From: domain for BIMI lookup (optional)
        my $from_domain = $sender;
        $from_domain =~ s/^.*\@//;

        my $authres = md_authres(
            $sender,       # envelope sender (MAIL FROM)
            $RelayAddr,    # connecting IP address
            $MyHostName,   # this server's hostname
            $Helo,         # EHLO/HELO name (optional)
            $from_domain,  # From: domain for BIMI (optional)
        );

        action_insert_header('Authentication-Results', $authres);
    }
