Title: documentation
Description: MIMEDefang documentation: man pages for mimedefang(8), mimedefang-filter(5), mimedefang.pl(8), and all command-line tools.
Author: gbechis
Slug: documentation/index
Status: published
Template: documentation
ld_json: {"@context":"https://schema.org","@type":"CollectionPage","@id":"https://mimedefang.org/documentation/#webpage","url":"https://mimedefang.org/documentation/","name":"MIMEDefang documentation","description":"MIMEDefang documentation: man pages for mimedefang(8), mimedefang-filter(5), mimedefang.pl(8), and all command-line tools.","inLanguage":"en","isPartOf":{"@id":"https://mimedefang.org/#website"},"about":{"@id":"https://mimedefang.org/#software"},"breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://mimedefang.org/"},{"@type":"ListItem","position":2,"name":"Documentation","item":"https://mimedefang.org/documentation/"}]}}

# Documentation

New to MIMEDefang? The [Getting Started guide](/getting-started/) walks you through installation, writing your first filter, and connecting it to your MTA.

Want a working filter quickly? The [Filter Generator](/filter-generator/) builds a `mimedefang-filter` with spam and virus checks, attachment blocking, SPF, DKIM and more.

---

## Man Pages - Commands

| Page | Description |
|---|---|
| [mimedefang(8)](../man_mimedefang.html) | Main milter daemon; connects Sendmail or Postfix to the multiplexor |
| [mimedefang.pl(8)](../man_mimedefang_pl.html) | Perl worker process that loads the filter script and processes messages |
| [mimedefang-multiplexor(8)](../man_mimedefang-multiplexor.html) | Manages the pool of Perl worker processes |
| [md-mx-ctrl(8)](../man_md-mx-ctrl.html) | Command-line tool for communicating with the multiplexor |
| [mimedefang-filter(5)](../man_mimedefang-filter.html) | Reference for writing your filter script (callbacks, actions, variables) |
| [mimedefang-release(8)](../man_mimedefang-release.html) | Releases or forwards quarantined messages |
| [mimedefang-notify(7)](../man_mimedefang-notify.html) | External socket notification interface for multiplexor state changes |
| [mimedefang-protocol(7)](../man_mimedefang-protocol.html) | Internal communication protocol between the daemon and multiplexor |

---

## Man Pages - Perl API

**Core**

- [Mail::MIMEDefang](../man_Mail::MIMEDefang.html) – core email filtering framework module
- [Mail::MIMEDefang::Actions](../man_Mail::MIMEDefang::Actions.html) – accept, reject, or modify message actions
- [Mail::MIMEDefang::MIME](../man_Mail::MIMEDefang::MIME.html) – MIME part manipulation methods
- [Mail::MIMEDefang::Mail](../man_Mail::MIMEDefang::Mail.html) – send mail and run SMTP checks
- [Mail::MIMEDefang::Utils](../man_Mail::MIMEDefang::Utils.html) – general utility helpers
- [Mail::MIMEDefang::RFC2822](../man_Mail::MIMEDefang::RFC2822.html) – RFC 2822 date formatting
- [Mail::MIMEDefang::Unit](../man_Mail::MIMEDefang::Unit.html) – unit testing support for filters

**Network and spam/virus checks**

- [Mail::MIMEDefang::Net](../man_Mail::MIMEDefang::Net.html) – RBL and network service lookups
- [Mail::MIMEDefang::Antispam](../man_Mail::MIMEDefang::Antispam.html) – SpamAssassin and rspamd integration
- [Mail::MIMEDefang::Antivirus](../man_Mail::MIMEDefang::Antivirus.html) – antivirus scanner integration

**Email authentication**

- [Mail::MIMEDefang::DKIM](../man_Mail::MIMEDefang::DKIM.html) – DKIM signing and verification
- [Mail::MIMEDefang::DKIM::ARC](../man_Mail::MIMEDefang::DKIM::ARC.html) – ARC (Authenticated Received Chain) signing
- [Mail::MIMEDefang::SPF](../man_Mail::MIMEDefang::SPF.html) – Sender Policy Framework checks
- [Mail::MIMEDefang::Authres](../man_Mail::MIMEDefang::Authres.html) – Authentication-Results header helpers
- [Mail::MIMEDefang::BIMI](../man_Mail::MIMEDefang::BIMI.html) – BIMI DNS record lookup and verification
- [Mail::MIMEDefang::TLSPolicy](../man_Mail::MIMEDefang::TLSPolicy.html) – MTA-STS and DANE/TLSA outbound TLS policy

**Asynchronous checks**

- [Mail::MIMEDefang::Async](../man_Mail::MIMEDefang::Async.html) – concurrent DNS, socket, and process checks
- [Mail::MIMEDefang::Async::Checks](../man_Mail::MIMEDefang::Async::Checks.html) – pre-built check descriptors for async use
- [Mail::MIMEDefang::Async::Results](../man_Mail::MIMEDefang::Async::Results.html) – translate async check output into filter decisions

---

## Changelog

- [Changelog](/documentation/Changelog.html)

---

## Additional Resources

- [Fighting Spam with Perl using Apache SpamAssassin & MIMEDefang](https://mcgrail.com/downloads/The%20Perl%20Conference%202019%20-%20%20Fighting%20Spam%20with%20Perl%20using%20Apache%20SpamAssassin%20&%20MIMEDefang%20.pdf) - slide deck from The Perl Conference 2019
