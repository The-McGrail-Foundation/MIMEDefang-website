Title: Filter Generator
Description: Build a ready-to-use MIMEDefang filter: choose SpamAssassin or Rspamd, ClamAV, attachment blocking, SPF, DKIM, greylisting and DNS blocklists, then download your mimedefang-filter.
Author: gbechis
Slug: filter-generator/index
Status: published
Template: filter-generator
ld_json: {"@context":"https://schema.org","@type":"WebApplication","name":"MIMEDefang Filter Generator","url":"https://mimedefang.org/filter-generator/","applicationCategory":"DeveloperApplication","operatingSystem":"Any","browserRequirements":"Requires JavaScript","isAccessibleForFree":true,"description":"Generates a mimedefang-filter Perl file with SpamAssassin or Rspamd spam checks, ClamAV virus scanning, attachment filtering, SPF, DKIM, Authentication-Results, DNS blocklists and greylisting.","publisher":{"@type":"Organization","name":"MIMEDefang","url":"https://mimedefang.org/"}}

Choose the features you need and the generator writes a `mimedefang-filter` for you.
Everything runs in your browser: nothing you enter is sent anywhere.
See [mimedefang-filter(5)](../man_mimedefang-filter.html) and the [snippets](/snippets/) to customize the result further.

**Test the filter before you install it.** Save the download as
`/etc/mail/mimedefang-filter.new` and run:

    mimedefang.pl -f /etc/mail/mimedefang-filter.new -test

It must print `Filter /etc/mail/mimedefang-filter.new seems syntactically correct.`
Any other output, such as a Perl syntax error or `Can't locate Mail/....pm`, must be
fixed first; it usually means a Perl module listed under the preview is not installed.
Then move the file to `/etc/mail/mimedefang-filter` and reload MIMEDefang.
The test checks only that the filter compiles and its modules load, not that it does
what you want: see [mimedefang.pl(8)](../man_mimedefang_pl.html#TESTING-FILTERS).
