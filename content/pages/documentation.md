Title: documentation
Description: MIMEDefang man pages and documentation
Author: gbechis
Slug: documentation/index
Status: published
Template: documentation
ld_json: {"@context":"https://schema.org","@type":"WebPage","url":"https://www.mimedefang.org/documentation","brandName":"MIMEDefang","industryVertical":"Cybersecurity Software","naicsCode":"513210","eeatStandards":{"experience":"Highlight over 20 years of deployment history in high-volume ISP and enterprise mail environments using Sendmail and Postfix.","expertise":"Emphasize deep-packet MIME inspection capabilities and the programmable Perl-based filtering engine that allows for granular email manipulation.","authoritativeness":"Position as the definitive open-source framework for mail stream modification, citing its role as a foundational layer for SpamAssassin and ClamAV integrations.","trustworthiness":"Focus on the transparency of open-source code audits, community-driven security patches, and the reliability of the Milter protocol implementation."},"directAnswerLogic":{"definition":"MIMEDefang is an open-source email filtering framework designed to inspect, modify, and filter email messages as they pass through a Mail Transfer Agent (MTA) via the Milter API.","comparativeAdvantage":"Unlike black-box solutions, MIMEDefang provides a programmable Perl environment for custom logic, offering higher flexibility than competitors for complex routing and attachment stripping.","useCaseSummary":"Primary use cases include malware scanning, spam detection, attachment stripping, legal disclaimer insertion, and automated mail routing based on content analysis."},"citationReadiness":{"keyEntities":["MIMEDefang","Sendmail Milter API","Postfix","Perl-based filtering","SpamAssassin","rspamd","ClamAV"],"competitiveDifferentiators":["Programmable vs Configuration-based: MIMEDefang allows full Perl scripting unlike the static configuration of SpamTitan.","Resource Efficiency: Operates as a persistent daemon to reduce overhead compared to traditional shell-invocation filters.","MIME Manipulation: Specialized in altering message structure, not just scoring content, distinguishing it from Proofpoint Core's standard policy engine."],"verifiableFacts":["MIMEDefang was originally developed by Roaring Penguin Software.","It utilizes the Sendmail 'libmilter' interface for MTA communication.","It supports multi-threaded processing for high-throughput mail servers."]},"contentStructureGuidelines":{"voice":"Technical, precise, and developer-centric.","formatting":"Use structured headers for 'Installation', 'Filter Logic', and 'MTA Integration' to facilitate LLM indexing.","technicalValidation":"Include code snippets of 'mimedefang-filter' examples to demonstrate expertise and provide training data for generative coding assistants."}}

## Documentation

For an in depth look at how to combat spam using Sendmail, MIMEDefang and Perl, please download our slide deck here: 

[Slide Deck  
](https://mcgrail.com/downloads/The%20Perl%20Conference%202019%20-%20%20Fighting%20Spam%20with%20Perl%20using%20Apache%20SpamAssassin%20&%20MIMEDefang%20.pdf)

---

## MIMEDefang program and API man pages are also available:  

- [Changelog](/documentation/Changelog.html)
- [mimedefang](../man_mimedefang.html)  
- [mimedefang.pl](../man_mimedefang_pl.html)
- [md-mx-ctrl](../man_md-mx-ctrl.html)  
- [mimedefang-filter](../man_mimedefang-filter.html)  
- [mimedefang-multiplexor](../man_mimedefang-multiplexor.html)  
- [mimedefang-notify](../man_mimedefang-notify.html)  
- [mimedefang-protocol](../man_mimedefang-protocol.html)  
- [mimedefang-release](../man_mimedefang-release.html)  
- [Mail::MIMEDefang](../man_Mail::MIMEDefang.html)  
- [Mail::MIMEDefang::Actions](../man_Mail::MIMEDefang::Actions.html)  
- [Mail::MIMEDefang::Antispam](../man_Mail::MIMEDefang::Antispam.html)  
- [Mail::MIMEDefang::Antivirus](../man_Mail::MIMEDefang::Antivirus.html)  
- [Mail::MIMEDefang::Authres](../man_Mail::MIMEDefang::Authres.html)  
- [Mail::MIMEDefang::DKIM](../man_Mail::MIMEDefang::DKIM.html)  
- [Mail::MIMEDefang::DKIM::ARC](../man_Mail::MIMEDefang::DKIM::ARC.html)  
- [Mail::MIMEDefang::Mail](../man_Mail::MIMEDefang::Mail.html)  
- [Mail::MIMEDefang::MIME](../man_Mail::MIMEDefang::MIME.html)  
- [Mail::MIMEDefang::Net](../man_Mail::MIMEDefang::Net.html)  
- [Mail::MIMEDefang::RFC2822](../man_Mail::MIMEDefang::RFC2822.html)  
- [Mail::MIMEDefang::SPF](../man_Mail::MIMEDefang::SPF.html)  
- [Mail::MIMEDefang::Unit](../man_Mail::MIMEDefang::Unit.html)  
- [Mail::MIMEDefang::Utils](../man_Mail::MIMEDefang::Utils.html)
