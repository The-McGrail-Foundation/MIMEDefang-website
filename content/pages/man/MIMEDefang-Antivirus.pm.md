Title: Mail::MIMEDefang::Antivirus(3) - man page
Description: Mail::MIMEDefang::Antivirus are a set of methods that can be called from mimedefang-filter(5) to scan with installed antivirus software the email message.
Author: gbechis
Slug: man_Mail::MIMEDefang::Antivirus
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Antivirus - Antivirus interface methods for email
filters

# DESCRIPTION

Mail::MIMEDefang::Antivirus are a set of methods that can be called from
*mimedefang-filter* to scan with installed antivirus software the email
message.

# METHODS

message_contains_virus

:   Method that scans a message using every installed virus scanner.

entity_contains_virus

:   Method that scans a `MIME::Entity` part using every installed virus
    scanner.

initialize_virus_scanner_routines

:   Method that sets `@VirusScannerMessageRoutines` and
    `@VirusScannerEntityRoutines` to arrays of virus-scanner routines to
    call, based on installed scanners.

run_virus_scanner

:   Method that runs a virus scanner, collecting output in
    `$VirusScannerMessages`.
