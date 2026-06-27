Title: Mail::MIMEDefang::BIMI(3) - man page
Description: Mail::MIMEDefang::BIMI provides methods to look up and verify BIMI DNS records from mimedefang-filter.
Author: gbechis
Slug: man_Mail::MIMEDefang::BIMI
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::BIMI - Brand Indicators for Message Identification support for MIMEDefang

# DESCRIPTION

Mail::MIMEDefang::BIMI provides methods to look up and verify BIMI DNS records
from `mimedefang-filter`. BIMI (Brand Indicators for Message Identification)
allows domain owners to publish a verified logo that mail clients can display
alongside authenticated messages.

A BIMI record is only considered valid when the sending domain passes DMARC
at enforcement level (`p=quarantine` or `p=reject`).

When the `Mail::BIMI` Perl module (version 3.x or later) is installed,
`md_bimi_lookup` and `md_bimi_verify` use it for richer validation,
including SVG logo integrity and Verified Mark Certificate (VMC) chain
verification. Without `Mail::BIMI` the checks are limited to DNS record
existence and a non-empty `l=` tag.

# METHODS

- md\_init

    Detect and load `Mail::BIMI` if installed, setting `$Features{"Mail::BIMI"}`.
    Called automatically by `detect_and_load_perl_modules` in `Mail::MIMEDefang`.

- md\_bimi\_get\_selector($entity)

    Extract the BIMI selector from the `BIMI-Selector` header of a
    `MIME::Entity` object.  The header format is:

        BIMI-Selector: v=BIMI1; s=brand1;

    Returns the selector string (e.g. `"brand1"`) on success, or `"default"`
    when the header is absent, malformed, or `$entity` is undefined.

    Typical usage in `filter_begin($entity)`:

        my $selector = md_bimi_get_selector($entity);
        my $result   = md_bimi_verify($domain, $dmarc_result, $policy, $selector);

- md\_bimi\_lookup($domain \[, $selector\])

    Look up the BIMI DNS TXT record for `$domain`.

    The optional `$selector` argument specifies which BIMI selector to query
    (e.g. `"brand1"` → `brand1._bimi.$domain`).  When omitted or `undef`,
    `"default"` is used.  Use `md_bimi_get_selector` to derive the selector
    from the message's `BIMI-Selector` header.

    Returns a hashref with the following keys on success:

    - `version`

        Always `BIMI1`.

    - `l`

        The URL of the SVG logo (`l=` tag).

    - `a`

        The URL of the Verified Mark Certificate (`a=` tag), if present.

    - `raw`

        The raw TXT record string.

    Returns `undef` if no BIMI record is found or if `Net::DNS` is not available.

- md\_bimi\_verify($domain, $dmarc\_result, $dmarc\_policy \[, $selector\])

    Verify that a domain's BIMI record is valid given the DMARC result.

    BIMI is only considered to pass when:

    - A BIMI DNS record exists for `$domain`.
    - `$dmarc_result` is `pass`.
    - `$dmarc_policy` is `quarantine` or `reject` (enforcement level).
    - The BIMI record contains a non-empty `l=` (logo URL) tag.

    Returns `"pass"` on success, `"fail"` otherwise.

    The method accepts the following parameters:

    - `$domain`

        The sender's domain (From: header domain).

    - `$dmarc_result`

        The DMARC result string, e.g. `"pass"` or `"fail"`.

    - `$dmarc_policy`

        The DMARC policy in effect: `"none"`, `"quarantine"`, or `"reject"`.

    - `$selector`

        Optional BIMI selector string.  Defaults to `"default"`.  Pass the value
        returned by `md_bimi_get_selector($entity)` to honour the message's
        `BIMI-Selector` header.
