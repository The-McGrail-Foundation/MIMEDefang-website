Title: MIMEDefang vs rspamd, amavisd-new and Mailmunge
Description: How MIMEDefang compares to rspamd, amavisd-new and Mailmunge: milter architecture, Perl policies, SMTP-time rejection, MIME rewriting, built-in features, and how to use MIMEDefang together with rspamd.
Author: gbechis
Slug: comparison/index
Status: published
Template: documentation
ld_json: {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is MIMEDefang an alternative to amavisd-new?","acceptedAnswer":{"@type":"Answer","text":"Yes. MIMEDefang is a native milter that runs Perl policies during the SMTP transaction, so it can reject mail before accepting it and rewrite any MIME part. amavisd-new usually runs as an after-queue content_filter."}},{"@type":"Question","name":"Should I use MIMEDefang or rspamd?","acceptedAnswer":{"@type":"Answer","text":"You can use both. rspamd is a spam-scoring engine; MIMEDefang is a mail-policy framework that can call rspamd with rspamd_check and reject, tag, quarantine or rewrite the message based on its verdict."}},{"@type":"Question","name":"When is rspamd alone a better fit than MIMEDefang?","acceptedAnswer":{"@type":"Answer","text":"When you only need spam scoring with a web UI and do not want to write any filter code."}},{"@type":"Question","name":"How do I migrate from amavisd-new to MIMEDefang?","acceptedAnswer":{"@type":"Answer","text":"Replace the Postfix content_filter with an smtpd_milters entry pointing to MIMEDefang, then port banned-file, antivirus, spam, quarantine and DKIM policies into the MIMEDefang filter."}},{"@type":"Question","name":"What is the difference between MIMEDefang and Mailmunge?","acceptedAnswer":{"@type":"Answer","text":"Mailmunge is a 2021 fork of MIMEDefang. It keeps the same milter and multiplexor design but replaces the Perl API with an object-oriented one. MIMEDefang keeps its filter API and ships more built-in features, such as antivirus integration, DNSBL checks, SPF, DMARC, ARC, BIMI and MTA-STS/DANE checks."}},{"@type":"Question","name":"Can I run MIMEDefang filters on Mailmunge?","acceptedAnswer":{"@type":"Answer","text":"Not unchanged. Mailmunge filters are complete Perl programs that subclass Mailmunge::Filter, so an existing MIMEDefang filter has to be ported, with help from Mailmunge::Filter::Compat."}}]}

# MIMEDefang vs rspamd, amavisd-new and Mailmunge

If you are choosing a mail filter today, you have probably looked at **rspamd**, **amavisd-new** and **Mailmunge**. All of them are good projects. This page explains where MIMEDefang is different, when it is the better choice, and when it is not.

In short: **amavisd-new** is a content-filter gateway, **rspamd** is a spam-scoring engine, and **MIMEDefang** is a programmable mail-policy framework. **Mailmunge** is a 2021 fork of MIMEDefang with a reworked object-oriented Perl API and fewer built-in features. MIMEDefang can replace amavisd-new, and it can work *together* with rspamd instead of competing with it.

---

## At a glance

| | MIMEDefang | amavisd-new | rspamd | Mailmunge |
|---|---|---|---|---|
| **What it is** | Mail-policy framework | Content-filter gateway | Spam-scoring engine | Mail-policy framework (MIMEDefang fork) |
| **MTA integration** | Native milter (Sendmail, Postfix, OpenSMTPD via filter-milter) | Mostly after-queue `content_filter` (SMTP/LMTP); milter through the separate amavisd-milter | Milter mode via `rspamd_proxy`, or HTTP API | Native milter (Sendmail, Postfix) |
| **Policy language** | Perl, with full access to envelope, headers and MIME tree | Perl configuration with predefined policy knobs | Lua rules, plus scores and actions in configuration | Perl, object-oriented (subclass `Mailmunge::Filter`, no global variables) |
| **Hooks during the SMTP session** | Connect, HELO, MAIL FROM, RCPT TO, and message body | Message body only | Message body (scan) | Connect, HELO, MAIL FROM, RCPT TO, and message body |
| **Reject before accepting the message** | Yes | Only in before-queue setups | Yes, in milter mode | Yes |
| **Rewrite MIME parts** | Yes: drop/replace attachments, add parts, add disclaimers, change headers | Limited (headers, banned-file defanging) | Limited (headers, subject) | Yes: drop/replace attachments, add parts, add disclaimers, change headers |
| **Spam detection** | Through Apache SpamAssassin or rspamd | Through Apache SpamAssassin or rspamd | Built in | Through Apache SpamAssassin or rspamd |
| **Antivirus** | ClamAV and many other scanners, built in | Many scanners | Through external scanners | Through the external File::VirusScan module |
| **DNSBL checks** | Built in, with parallel lookups | Through SpamAssassin | Built in | Through the external Net::DNSBL::Client module |
| **DKIM / ARC / SPF / DMARC / BIMI** | All of them, plus MTA-STS/DANE checks | DKIM | DKIM, ARC, SPF, DMARC | DKIM signing |
| **Monitoring** | `md-mx-ctrl`, `watch-mimedefang` | amavisd-snmp-subagent | Web UI | `mm-mx-ctrl`, `watch-multiple-mailmunges` |
| **Process model** | Preforked pool of Perl workers managed by `mimedefang-multiplexor`, with autoscaling | Preforked Perl daemon | Event-driven C workers | Preforked pool of Perl workers managed by `mailmunge-multiplexor` |
| **Licence** | GPL-2.0 | GPL-2.0 or BSD | Apache-2.0 | GPL-2.0 |
| **In production since** | 2000 | 2000s | 2013 | 2021 (fork of MIMEDefang) |

---

## Why choose MIMEDefang

- **Your policy is code, not a config file.** Any rule you can write in Perl becomes a filter: per-recipient policy, routing decisions, database or LDAP lookups, and attachment handling that depends on who is sending to whom.
- **You decide during the SMTP transaction.** MIMEDefang is a milter, so you can reject at `RCPT TO` or after `DATA` while the client is still connected. Your server never accepts mail it will later bounce.
- **It can change messages, not only score them.** Remove dangerous attachments, convert `winmail.dat`, append disclaimers, or replace attachments with links.
- **It works with the tools you already use.** SpamAssassin, rspamd, ClamAV, DKIM/ARC signing, SPF, DMARC and BIMI all work with a few lines of filter code. See the [Snippets](/snippets/).
- **It is mature and stable.** In production since 2000 and now maintained by The McGrail Foundation.

---

## Use MIMEDefang together with rspamd

You do not have to choose. A common setup lets rspamd score each message while MIMEDefang decides what to do with the result:

    sub filter_end {
        my ($entity) = @_;
        my ($hits, $req, $names, $report, $action, $is_spam) = rspamd_check();
        if ($action eq 'reject') {
            return action_bounce("Message rejected as spam");
        }
        if ($is_spam eq 'true') {
            action_change_header("X-Spam-Score", "$hits/$req $names");
        }
    }

rspamd brings the fast scoring, Bayes classifier and web UI. MIMEDefang brings the per-site policy and the MIME rewriting. amavisd-new can also call rspamd, but in its usual after-queue setup the message has already been accepted, so it cannot reject while the client is still connected, and it cannot rewrite the MIME tree the way a MIMEDefang filter can. See [How can I use rspamd to detect spam messages?](/how-can-i-use-rspamd-to-detect-spam-messages.html) and `rspamd_check` in [mimedefang-filter(5)](/man_mimedefang-filter.html).

---

## MIMEDefang and Mailmunge

Mailmunge was forked from MIMEDefang in 2021 by Dianne Skoll, MIMEDefang's original author. The two projects share their roots, so they have more in common than any other pair on this page.

### What they share

- A C milter that talks to a multiplexor, which manages a pool of preforked Perl workers.
- Decisions during the SMTP session, at connect, HELO, `MAIL FROM`, `RCPT TO` and after `DATA`.
- Full rewriting of the MIME tree: drop, replace or add parts, and change headers.
- Integration with SpamAssassin and rspamd.

### Where they differ

**The filter API.** Mailmunge replaced the Perl API:

- In **Mailmunge**, a filter is a complete Perl program that subclasses `Mailmunge::Filter`. It reads message data from a context object instead of global variables and returns response objects.
- In **MIMEDefang**, the filter API is the one it has had since 2000, so filters written years ago still run. New features come as `Mail::MIMEDefang::*` modules.

A MIMEDefang filter does not run unchanged on Mailmunge. It has to be ported, with help from `Mailmunge::Filter::Compat`.

**What is in the box.** Both cover the same tasks, but MIMEDefang bundles more of them:

| Feature | MIMEDefang | Mailmunge |
|---|---|---|
| Antivirus | Built in, many scanners | External module (File::VirusScan) |
| DNSBL checks | Built in, with parallel lookups | External module (Net::DNSBL::Client) |
| DKIM | Signing and verification | Signing |
| SPF, DMARC, ARC, BIMI | Built in | Not included |
| MTA-STS / DANE checks | Built in | Not included |
| Greylisting, SMTP call-forward, MX checks | Built in | Built in |
| Parallel asynchronous checks | Built in | Not included |
| Worker autoscaling | Built in | Not included |
| OpenSMTPD support | Yes, through mimedefang-smtpd-filter | No |

**Maintenance.** MIMEDefang is maintained by The McGrail Foundation.

### Running both

Both programs can be installed on the same host, because they use different user IDs, spool directories and configuration directories. You can therefore move traffic from one to the other gradually.

---

## When another tool may fit better

- You want a spam filter that works out of the box with a web UI and **no code to write**: use rspamd alone.
- You run a **very high-volume** gateway where spam scoring is the only requirement: rspamd's event-driven C core is hard to beat.
- You rely on amavisd-new's **SQL quarantine and release workflow**, and nothing in your policy needs SMTP-time decisions.
- You are writing a new filter from scratch, you prefer a strictly **object-oriented Perl API with no global variables**, and Mailmunge's bundled modules cover your needs: Mailmunge is a good fit.

---

## Migrating from amavisd-new

1. Install MIMEDefang. See [Getting Started](/getting-started/).
2. In Postfix, remove the `content_filter` line from `main.cf` and the amavis services from `master.cf`. Then add MIMEDefang to `smtpd_milters`. See [How do I integrate MIMEDefang with Postfix?](/faq/#how-do-i-integrate-mimedefang-with-postfix).
3. Port your policies into `/etc/mail/mimedefang-filter`:
    - banned file names → `re_match` / `re_match_in_zip_directory` with `action_drop_with_warning`
    - virus scanning → `message_contains_virus`
    - spam scoring → `spam_assassin_check`, `md_spamc_check` or `rspamd_check`
    - quarantine → `action_quarantine`
    - DKIM signing → `md_dkim_sign`
4. Check the filter with `mimedefang.pl -f /etc/mail/mimedefang-filter -test` before reloading. Then watch the mail log.

Questions? Ask on the [mailing list](/mailing-list/).
