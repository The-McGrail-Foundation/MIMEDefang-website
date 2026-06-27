Title: Mail::MIMEDefang::Actions(3) - man page
Description: Mail::MIMEDefang::Actions are a set of methods that can be called from mimedefang-filter(5) to accept or reject the email message.
Author: gbechis
Slug: man_Mail::MIMEDefang::Actions
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::Actions - actions methods for email filters

# DESCRIPTION

Mail::MIMEDefang::Actions are a set of methods that can be called
from `mimedefang-filter` to accept or reject the email message.

# METHODS

- action\_rebuild

    Sets a flag telling MIMEDefang to rebuild message even if it is
    unchanged.

- action\_add\_entity

    Makes a note to add a part to the message.  Parts are \*actually\* added
    at the end, which lets us correctly handle non-multipart messages or
    multipart/foo where "foo" != "mixed".  Sets the rebuild flag.

- action\_add\_part

    Makes a note to add a part to the message.  Parts are \*actually\* added
    at the end, which lets us correctly handle non-multipart messages or
    multipart/foo where "foo" != "mixed".  Sets the rebuild flag.

- process\_added\_parts

    Actually adds requested parts to entity.  Ensures that entity is
    of type multipart/mixed.

- action\_insert\_header

    Makes a note for milter to insert a header in the message in the
    specified position.  May not be supported on all versions of Sendmail;
    on unsupported versions, the C milter falls back to action\_add\_header.

- action\_add\_header

    Makes a note for milter to add a header to the message.

- action\_change\_header

    Makes a note for milter to change a header in the message.

- action\_delete\_header

    Makes a note for milter to delete a header in the message.

- action\_delete\_all\_headers

    Makes a note for milter to delete all instances of header.

- action\_accept

    Makes a note for milter to accept the current part.

- action\_accept\_with\_warning

    Makes a note for milter to accept the current part,
    but add a warning to the message.

- message\_rejected

    Method that returns True if message has been rejected
    (with action\_bounce or action\_tempfail), false otherwise.

- action\_drop

    Makes a note for milter to drop the current part without
    any warning.

- action\_drop\_with\_warning

    Makes a note for milter to drop the current part
    and add a warning to the message.

- action\_replace\_with\_warning

    Makes a note for milter to drop the current part
    and replace it with a warning.

- action\_defang

    Makes a note for milter to defang the current part by changing its name,
    filename and possibly MIME type.

- action\_external\_filter

    Pipes the part through the UNIX command $cmd, and replaces the
    part with the result of running the filter.

- action\_quarantine

    Makes a note for milter to drop the current part,
    emails the MIMEDefang administrator a notification,
    and quarantines the part in the quarantine directory.

- action\_sm\_quarantine

    Asks Sendmail to quarantine message in mqueue using Sendmail's
    smfi\_quarantine facility.

- get\_quarantine\_dir

    Method that returns the configured quarantine directory.

- action\_greylist($dbh, $sender, $recipient, $ip, $min\_retry, $max\_retry)

    $dbh is a DBI handle connected to the greylist database.
    $dbh object should be initialized in filter\_initialize sub.
    $min\_delay and $max\_delay are the minimum and maximum retry delays
    respectively, those parameters are optional (default values are 300 and 14400 seconds).
    If an SMTP client tries to deliver email faster, it
    will continue to be greylisted.
    $ip, $sender and $recipient are used to identify a unique connection.
    If it waits longer, it will begin the greylisting test from scratch.
    $ip is the IP address of the connecting SMTP client, to greylist an entire
    subnet you can pass the subnet instead.
    In `filter_cleanup` sub, the database connection should be closed.

    Returns "tempfail" if a new sender sends the email from a new ip address,
    "continue" if the email is allowed to pass or "reject" if the email has been
    greylisted for too much time.

- action\_quarantine\_entire\_message

    Method that puts a copy of the entire message in the quarantine directory.

- action\_bounce

    Method that Causes the SMTP transaction to fail with an SMTP 554 failure code
    and the specified reply text.
    If code or DSN are omitted or invalid, use 554 and 5.7.1.

- action\_discard

    Method that causes the entire message to be silently discarded without
    notifying anyone.

- action\_notify\_sender

    Method that sends an email to the sender containing the $msg.

- action\_notify\_administrator

    Method that sends an email to MIMEDefang administrator containing the $msg.

- action\_tempfail

    Method that sends a temporary failure with a 4.x.x SMTP code.
    If code or DSN are omitted or invalid, use 451 and 4.3.0.

- add\_recipient

    Signals to MIMEDefang to add a recipient to the envelope.

- delete\_recipient

    Signals to MIMEDefang to delete a recipient from the envelope.

- change\_sender

    Signals to MIMEDefang to change the envelope sender.

- action\_replace\_with\_url

    Method that places the part in doc\_root/{sha1\_of\_part}.ext and replaces it with
    a text/plain part giving the URL for pickup.
