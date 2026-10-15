Title: MIMEDefang vs rspamd and amavisd-new
Description: How MIMEDefang compares to rspamd and amavisd-new: milter architecture, Perl policies, SMTP-time rejection, MIME rewriting, and how to use MIMEDefang together with rspamd.
Author: gbechis
Slug: comparison/index
Status: published
Template: documentation
ld_json: {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is MIMEDefang an alternative to amavisd-new?","acceptedAnswer":{"@type":"Answer","text":"Yes. MIMEDefang is a native milter that runs Perl policies during the SMTP transaction, so it can reject mail before accepting it and rewrite any MIME part. amavisd-new usually runs as an after-queue content_filter."}},{"@type":"Question","name":"Should I use MIMEDefang or rspamd?","acceptedAnswer":{"@type":"Answer","text":"You can use both. rspamd is a spam-scoring engine; MIMEDefang is a mail-policy framework that can call rspamd with rspamd_check and reject, tag, quarantine or rewrite the message based on its verdict."}},{"@type":"Question","name":"When is rspamd alone a better fit than MIMEDefang?","acceptedAnswer":{"@type":"Answer","text":"When you only need spam scoring with a web UI and do not want to write any filter code."}},{"@type":"Question","name":"How do I migrate from amavisd-new to MIMEDefang?","acceptedAnswer":{"@type":"Answer","text":"Replace the Postfix content_filter with an smtpd_milters entry pointing to MIMEDefang, then port banned-file, antivirus, spam, quarantine and DKIM policies into the MIMEDefang filter."}}]}

# MIMEDefang vs rspamd and amavisd-new

If you are choosing a mail filter today, you have probably looked at **rspamd** and **amavisd-new**. Both are good projects. This page explains where MIMEDefang is different, when it is the better choice, and when it is not.

In short: **amavisd-new** is a content-filter gateway, **rspamd** is a spam-scoring engine, and **MIMEDefang** is a programmable mail-policy framework. MIMEDefang can replace amavisd-new, and it can work *together* with rspamd instead of competing with it.

---

## At a glance

| | MIMEDefang | amavisd-new | rspamd |
|---|---|---|---|
| **What it is** | Mail-policy framework | Content-filter gateway | Spam-scoring engine |
| **MTA integration** | Native milter (Sendmail, Postfix, OpenSMTPD via filter-milter) | Mostly after-queue `content_filter` (SMTP/LMTP); milter through the separate amavisd-milter | Milter mode via `rspamd_proxy`, or HTTP API |
| **Policy language** | Perl, with full access to envelope, headers and MIME tree | Perl configuration with predefined policy knobs | Lua rules, plus scores and actions in configuration |
| **Hooks during the SMTP session** | Connect, HELO, MAIL FROM, RCPT TO, and message body | Message body only | Message body (scan) |
| **Reject before accepting the message** | Yes (no backscatter) | Only in before-queue setups | Yes, in milter mode |
| **Rewrite MIME parts** | Yes: drop/replace attachments, add parts, add disclaimers, change headers | Limited (headers, banned-file defanging) | Limited (headers, subject) |
| **Spam detection** | Through Apache SpamAssassin or rspamd | Through Apache SpamAssassin or rspamd | Built in |
| **Antivirus** | ClamAV and many other scanners | Many scanners | Through external scanners |
| **DKIM / ARC / SPF / DMARC / BIMI** | Yes (DKIM, ARC, SPF, DMARC, BIMI) | DKIM | DKIM, ARC, SPF, DMARC |
| **Process model** | Preforked pool of Perl workers managed by `mimedefang-multiplexor` | Preforked Perl daemon | Event-driven C workers |
| **Licence** | GPL-2.0 | GPL-2.0 or BSD | Apache-2.0 |
| **In production since** | 2000 | 2000s | 2013 |

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

## When another tool may fit better

- You want a spam filter that works out of the box with a web UI and **no code to write**: use rspamd alone.
- You run a **very high-volume** gateway where spam scoring is the only requirement: rspamd's event-driven C core is hard to beat.
- You rely on amavisd-new's **SQL quarantine and release workflow**, and nothing in your policy needs SMTP-time decisions.

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
