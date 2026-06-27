Title: How can I scan messages for viruses?
Date: 2026-06-27 10:06:00
Category: snippets
Tags: Antivirus
Num: 012
Status: published

Virus scanning should be done in `filter_end` to inspect the fully assembled message.
`message_contains_virus` calls every installed virus scanner (e.g. ClamAV) and returns
the scanner name, the virus name, and a code (`'ok'`, `'virus'`, or `'error'`).

    use Mail::MIMEDefang::Antivirus;

    sub filter_end {
        my($entity) = @_;

        my ($code, $category, $action) = message_contains_virus();

        if ($code eq 'virus') {
            md_syslog('Warning',
                "Virus detected in message from $sender ($RelayAddr): $category");
            md_graphdefang_log('virus', $category, $RelayAddr);
            return action_bounce("Message rejected: virus detected ($category)");
        }

        if ($code eq 'error') {
            md_syslog('Warning',
                "Virus scanner error for message from $sender: $category");
            # Tempfail on scanner error to avoid letting infected mail through
            return action_tempfail("Temporary error during virus scan, please try again");
        }
    }
