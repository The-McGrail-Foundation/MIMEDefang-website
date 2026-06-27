Title: How can I append a disclaimer to outgoing messages?
Date: 2026-06-27 10:02:00
Category: snippets
Tags: Attachments
Num: 008
Status: published

Disclaimers are best appended in `filter_end`, after all message parts have been processed.
`append_text_boilerplate` handles plain-text parts and `append_html_boilerplate` handles HTML parts,
inserting the HTML disclaimer before the closing `</body>` tag when possible.

    use Mail::MIMEDefang::MIME;

    sub filter_end {
        my($entity) = @_;

        # Only append disclaimer to outbound mail
        return unless $RelayAddr =~ /^(192\.168\.|10\.|172\.1[6-9]\.|172\.2\d\.|172\.3[01]\.)/;

        my $text_disclaimer = "\n--\nThis message and any attachments are confidential.\n";
        my $html_disclaimer = '<br><hr><p style="font-size:small;color:#666">'
            . 'This message and any attachments are confidential.</p>';

        append_text_boilerplate($entity, $text_disclaimer, 0);
        append_html_boilerplate($entity, $html_disclaimer, 0);
    }
