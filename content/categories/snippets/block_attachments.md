Title: How can I block dangerous file attachments?
Date: 2026-06-27 10:08:00
Category: snippets
Tags: Attachments
Num: 014
Status: published

Attachment filtering is done in `filter`, which is called once per MIME part.
The example below drops executables, scripts, and macro-enabled Office documents.
Use `action_drop_with_warning` to notify the recipient, or `action_defang` to rename
the attachment and neutralise it rather than removing it entirely.

    sub filter {
        my($entity, $fname, $ext, $type) = @_;

        # Extensions considered dangerous
        my @blocked_extensions = qw(
            exe com bat cmd scr pif vbs vbe js jse
            ps1 ps2 jar docm xlsm pptm
        );

        my $lext = lc($ext);
        $lext =~ s/^\.//;  # strip leading dot if present

        if (grep { $_ eq $lext } @blocked_extensions) {
            md_syslog('Warning',
                "Blocked attachment '$fname' (.$lext) from $sender");
            md_graphdefang_log('attachment_blocked', $fname, $RelayAddr);
            return action_drop_with_warning(
                "An attachment named '$fname' was removed because its file type "
                . "(.$lext) is not permitted.");
        }

        return action_accept();
    }
