Title: Mail::MIMEDefang::Async::Checks(3) - man page
Description: Mail::MIMEDefang::Async::Checks provides pre-built check descriptors for use with Mail::MIMEDefang::Async.
Author: gbechis
Slug: man_Mail::MIMEDefang::Async::Checks
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Async::Checks - Pre-built check descriptors for Mail::MIMEDefang::Async

# DESCRIPTION

Each function returns a check-hashref suitable for passing to
`md_async_run_checks()`. Mix and match to build the checks your filter needs.

# METHODS

- md\_async\_check\_dnsbl(%args)

    Build a DNSBL A-record lookup check. Required args: `ip`, `zone`.
    Optional: `name`, `timeout`.

- md\_async\_check\_spf\_record(%args)

    Build an SPF TXT-record lookup check. Required: `domain`.

- md\_async\_check\_mx\_exists(%args)

    Build an MX-record existence check. Domains with no MX are often forged.
    Required: `domain`.

- md\_async\_check\_rdns(%args)

    Build a reverse-DNS (PTR) lookup check. Required: `ip`.

- md\_async\_check\_dkim\_record(%args)

    Build an async lookup for a DKIM public-key TXT record at
    `$selector._domainkey.$domain`. Required: `selector`, `domain`.

    The result is the raw TXT record string. Signature evaluation still happens
    synchronously via `Mail::DKIM` after the key is fetched.

- md\_async\_check\_dmarc\_record(%args)

    Build an async lookup for the DMARC TXT record at `_dmarc.$domain`.
    Required: `domain`.

    Use `md_async_interpret_dmarc()` from [Mail::MIMEDefang::Async::Results](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync%3A%3AResults) to
    parse the result.

# SEE ALSO

[Mail::MIMEDefang::Async](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync), [Mail::MIMEDefang::Async::Results](https://metacpan.org/pod/Mail%3A%3AMIMEDefang%3A%3AAsync%3A%3AResults)
