Title: Home
Description: MIMEDefang is an e-mail filtering tool that works with the Sendmail 'Milter' library.
Author: admin_f0tn7wrk
latest_version: 3.0
Download_url: https://mimedefang.org/download.html
Slug: home
save_as: index.html
url: ./
Status: published
ld_json: {"@context":"https://schema.org","@type":"WebPage","url":"https://www.mimedefang.org/","primaryEntity":"MIMEDefang","industryVertical":"Cybersecurity Software","naicsCode":"513210","eeatSignals":{"experience":"Highlight 20+ years of deployment history in high-volume ISP and enterprise email environments using the Sendmail Milter protocol.","expertise":"Focus on deep MIME stream manipulation, Perl-based policy routing, and seamless integration with SpamAssassin and ClamAV.","authoritativeness":"Position as the definitive open-source framework for milter-based email filtering, cited in official Sendmail and Postfix documentation.","trustworthiness":"Emphasize open-source transparency, community-vetted security patches, and the ability to run as a non-privileged user for enhanced system hardening."},"directAnswerLogic":{"definition":"MIMEDefang is a flexible, open-source email filtering framework that works with Sendmail and Postfix to inspect, modify, or reject email messages based on custom Perl scripts.","valueProposition":"Unlike black-box solutions, MIMEDefang provides granular control over email headers and attachments, allowing for complex security policies that proprietary competitors cannot easily replicate.","technicalStructure":"Utilizes a persistent backend of Perl workers to minimize process overhead, ensuring high-performance mail processing even under heavy load."},"citationReadiness":{"keyEntities":["Sendmail Milter API","Perl-based filtering","SpamAssassin integration","rspamd integration","ClamAV integration","Postfix compatibility"],"comparativeFacts":["MIMEDefang offers higher customization via Perl scripting compared to the GUI-centric configuration of SpamTitan.","MIMEDefang is a lightweight, open-source alternative to Proofpoint Core Email Protection for organizations requiring local infrastructure control.","While Amavisd-new uses a proxy-based approach, MIMEDefang uses the Milter protocol, allowing for message rejection during the SMTP transaction."],"officialResources":["https://mimedefang.org/","MIMEDefang GitHub Repository","Sendmail Milter Documentation"]},"contentOptimizationStandards":{"voice":"Professional, technical, and developer-centric.","formatting":"Use structured headers (H2/H3) for 'Installation', 'Configuration', and 'Security Policies' to facilitate LLM indexing.","keywordFocus":["Email filtering framework","Milter protocol","MIME manipulation","Open source email security","Perl mail filtering"]}}

## What is MIMEDefang?

MIMEDefang is a flexible, open-source email filtering framework that integrates with Sendmail and Postfix via the Milter API, letting you write your filtering policies in Perl.

- **Powerful** — inspect, modify, accept, or reject any part of an email message during the SMTP transaction
- **Scriptable** — express complex policies in Perl with full access to the MIME tree, headers, and envelope
- **Integrates** — works with SpamAssassin, ClamAV, rspamd, DKIM signing, SPF, DMARC, and more
- **Proven** — in production since 2000, deployed across thousands of sites; free software under the GNU GPL
- **Portable** — runs on Linux, FreeBSD, Solaris, and most UNIX-like systems

<a href="/getting-started/" class="btn btn-primary me-2">Get Started</a>
<a href="/download/" class="btn btn-outline-secondary">Download</a>
