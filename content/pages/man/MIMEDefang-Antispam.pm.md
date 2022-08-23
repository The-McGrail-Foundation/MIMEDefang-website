Title: MIMEDefang - documentation
Date: 2022-08-24 00:00:24
Author: gbechis
Slug: man_Mail::MIMEDefang::Antispam
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Antispam - antispam related methods for email filters

# DESCRIPTION

Mail::MIMEDefang::Antispam are a set of methods that can be called from
*mimedefang-filter* to check email messages with antispam softwares.

# METHODS

spam_assassin_is_spam

:   Method that scans a mmessage using SpamAssassin and returns True if
    the email message has been detected as spam.

spam_assassin_check

:   Method that scans a message using SpamAssassin and returns an array
    of four elements,

    -   Weight of message (\'hits\')

    -   Number of hits required before SA considers a message spam

    -   Comma separated list of symbolic test names that were triggered

    -   A \'report\' string, detailing tests that failed and their
        weights

spam_assassin_status

:   Method that scans a mmessage using SpamAssassin and returns a
    `Mail::SpamAssassin:PerMsgStatus` object. The caller is responsible
    for calling the `finish` method.

spam_assassin_init

:   Initialize Apache SpamAssassin and returns a `Mail::SpamAssassin`
    object.

spam_assassin_mail

:   Method that calls SpamAssassin and returns a
    `Mail::SpamAssassin::Message` object.

rspamd_check

:   Method that scans the message using Rspamd and returns an array of
    six elemets:

    -   Weight of message (\'hits\')

    -   Number of hits required before Rspamd considers a message spam

    -   Comma separated list of symbolic test names that were triggered

    -   A \'report\' string, detailing tests that failed and their
        weights or a Json report if JSON and LWP modules are present

    -   An action that should be applied to the email

    -   A flag explaining if the email is a spam message or not
        (true/false).

    An optional rspamd url can be passed to the method, its default
    value is http://127.0.0.1:11333.
