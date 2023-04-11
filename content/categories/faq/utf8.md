Title: There are some UTF-8 related errors on log files
Date: 2023-04-11 22:41:05
Category: faq
Num: 006
Status: published

**Symptom**: On log files there are some errors like `Worker 1 stderr: Unable to convert text in character set GB18030 to UTF-8`

**Cause**: This is almost certainly due to missing support in Perl installation for the GB18030 character encoding, a comprehensive encoding for Chinese characters.  
That support requires the Encode::HanExtra module, which you can install via CPAN.
