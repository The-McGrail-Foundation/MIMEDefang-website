Title: MIMEDefang - documentation
Date: 2022-07-01 10:34:32
Author: gbechis
Slug: man_Mail::MIMEDefang::Actions
Status: published
Template: documentation

# NAME
    Mail::MIMEDefang::Actions - actions methods for email filters

# DESCRIPTION
    Mail::MIMEDefang::Actions are a set of methods that can be called from
    mimedefang-filter to accept or reject the email message.

# METHODS
    action_rebuild
        Sets a flag telling MIMEDefang to rebuild message even if it is
        unchanged.

    action_add_entity
        Makes a note to add a part to the message. Parts are *actually*
        added at the end, which lets us correctly handle non-multipart
        messages or multipart/foo where "foo" != "mixed". Sets the rebuild
        flag.

    action_add_part
        Makes a note to add a part to the message. Parts are *actually*
        added at the end, which lets us correctly handle non-multipart
        messages or multipart/foo where "foo" != "mixed". Sets the rebuild
        flag.

    process_added_parts
        Actually adds requested parts to entity. Ensures that entity is of
        type multipart/mixed.

    action_insert_header
        Makes a note for milter to insert a header in the message in the
        specified position. May not be supported on all versions of
        Sendmail; on unsupported versions, the C milter falls back to
        action_add_header.

    action_add_header
        Makes a note for milter to add a header to the message.

    action_change_header
        Makes a note for milter to change a header in the message.

    action_delete_header
        Makes a note for milter to delete a header in the message.

    action_delete_all_headers
        Makes a note for milter to delete all instances of header.

    action_accept
        Makes a note for milter to accept the current part.

    action_accept_with_warning
        Makes a note for milter to accept the current part, but add a
        warning to the message.

    message_rejected
        Method that returns True if message has been rejected (with
        action_bounce or action_tempfail), false otherwise.

    action_drop
        Makes a note for milter to drop the current part without any
        warning.

    action_drop_with_warning
        Makes a note for milter to drop the current part and add a warning
        to the message.

    action_replace_with_warning
        Makes a note for milter to drop the current part and replace it with
        a warning.

    action_defang
        Makes a note for milter to defang the current part by changing its
        name, filename and possibly MIME type.

    action_external_filter
        Pipes the part through the UNIX command $cmd, and replaces the part
        with the result of running the filter.

    action_quarantine
        Makes a note for milter to drop the current part, emails the
        MIMEDefang administrator a notification, and quarantines the part in
        the quarantine directory.

    action_sm_quarantine
        Asks Sendmail to quarantine message in mqueue using Sendmail's
        smfi_quarantine facility.

    get_quarantine_dir
        Method that returns the configured quarantine directory.

    action_quarantine_entire_message
        Method that puts a copy of the entire message in the quarantine
        directory.

    action_bounce
        Method that Causes the SMTP transaction to fail with an SMTP 554
        failure code and the specified reply text. If code or DSN are
        omitted or invalid, use 554 and 5.7.1.

    action_discard
        Method that causes the entire message to be silently discarded
        without without notifying anyone.

    action_notify_sender
        Method that sends an email to the sender containing the $msg.

    action_notify_administrator
        Method that sends an email to MIMEDefang administrator containing
        the $msg.

    action_tempfail
        Method that sends a temporary failure with a 4.x.x SMTP code. If
        code or DSN are omitted or invalid, use 451 and 4.3.0.

    add_recipient
        Signals to MIMEDefang to add a recipient to the envelope.

    delete_recipient
        Signals to MIMEDefang to delete a recipient from the envelope.

    change_sender
        Signals to MIMEDefang to change the envelope sender.

    action_replace_with_url
        Method that places the part in doc_root/{sha1_of_part}.ext and
        replaces it with a text/plain part giving the URL for pickup.
