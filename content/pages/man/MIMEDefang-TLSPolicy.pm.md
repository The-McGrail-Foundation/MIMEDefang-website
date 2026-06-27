Title: Mail::MIMEDefang::TLSPolicy(3) - man page
Description: Mail::MIMEDefang::TLSPolicy provides methods to verify outbound TLS policy (MTA-STS and DANE/TLSA) for recipient domains from mimedefang-filter.
Author: gbechis
Slug: man_Mail::MIMEDefang::TLSPolicy
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::TLSPolicy - MTA-STS and DANE/TLSA policy checks for MIMEDefang

# DESCRIPTION

Mail::MIMEDefang::TLSPolicy provides methods to verify outbound TLS policy
for recipient domains from `mimedefang-filter`.

- **MTA-STS** (RFC 8461) - retrieve and parse a domain's MTA-STS policy
(DNS TXT + HTTPS policy file).
- **DANE/TLSA** (RFC 6698 / RFC 7671) - look up TLSA records for a domain
and port to verify certificate binding.

Both functions require `Net::DNS`.  `md_check_mta_sts` additionally
requires `LWP::UserAgent`.

Typical usage:

    use Mail::MIMEDefang::TLSPolicy;

    # In filter_recipient: fetch the MTA-STS policy for the recipient domain,
    # then verify the connecting MX is permitted before requiring TLS.
    my $policy = md_check_mta_sts($recipient_domain);
    if (defined $policy && $policy->{mode} eq 'enforce') {
        if (!md_verify_sts_mx($rcpt_host, $policy)) {
            action_bounce("MX host $rcpt_host not permitted by MTA-STS policy");
        }
    }

    # Look up DANE TLSA records for port 25 and validate the peer certificate.
    my @tlsa = md_check_dane_tlsa($recipient_domain, 25);
    if (@tlsa) {
        unless (md_verify_dane_cert($peer_cert_der, \@tlsa)) {
            # certificate does not match any TLSA record - reject or defer
        }
    }

# METHODS

- md\_check\_mta\_sts($domain \[, %opts\])

    Retrieve and parse the MTA-STS policy for `$domain`.

    The function performs two lookups:

    1. A DNS TXT query for `_mta-sts.$domain` to confirm the policy exists and
    extract its `id=` field.
    2. An HTTPS fetch of
    `https://mta-sts.$domain/.well-known/mta-sts.txt` to retrieve the
    policy document.

    Optional key/value pairs in `%opts`:

    - `timeout`

        HTTP request timeout in seconds (default: 10).

    On success returns a hashref with:

    - `mode`

        Policy mode: `enforce`, `testing`, or `none`.

    - `max_age`

        Cache lifetime in seconds.

    - `mx`

        Arrayref of permitted MX hostname patterns.

    - `id`

        The policy `id` from the DNS TXT record.

    Returns `undef` on any error (DNS failure, HTTP error, policy parse
    failure, or if `LWP::UserAgent` is not available).

- md\_check\_dane\_tlsa($domain, $port)

    Look up DANE TLSA records for `_$port._tcp.$domain`.

    Returns a list of hashrefs, one per TLSA record, each containing:

    - `usage`

        Certificate usage field (0–3).

    - `selector`

        Selector field (0 = full certificate, 1 = SubjectPublicKeyInfo).

    - `matching_type`

        Matching type (0 = exact, 1 = SHA-256, 2 = SHA-512).

    - `cert_data`

        Hex-encoded certificate association data.

    Returns an empty list if no TLSA records are found, on lookup error, or
    if `Net::DNS` is not available.

- md\_verify\_sts\_mx($mx\_host, $policy)

    Returns true if `$mx_host` matches at least one MX hostname pattern
    in `$policy-`{mx}> (a hashref returned by ["md\_check\_mta\_sts($domain \[, %opts\])"](#md_check_mta_sts-domain-opts)).

    Matching follows RFC 8461: a pattern beginning with `*.` matches any
    single DNS label prepended to the rest of the pattern
    (e.g. `*.example.com` matches `mail.example.com` but not
    `a.b.example.com`).  All comparisons are case-insensitive.

    Returns false if `$policy` is undefined, has no `mx` list, or no
    pattern matches.

- md\_verify\_dane\_cert($cert\_der, \\@tlsa)

    Verify a DER-encoded X.509 certificate against a list of DANE TLSA records
    as returned by ["md\_check\_dane\_tlsa($domain, $port)"](#md_check_dane_tlsa-domain-port).

    Returns true if the certificate matches at least one record, false otherwise.

    Selector 0 (full certificate) requires only `Digest::SHA`.
    Selector 1 (SubjectPublicKeyInfo) additionally requires
    `Crypt::OpenSSL::X509`; records with selector 1 are skipped silently if
    that module is not available.
