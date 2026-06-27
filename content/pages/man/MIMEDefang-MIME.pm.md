Title: Mail::MIMEDefang::MIME (3) - man page
Description: Mail::MIMEDefang::MIME are a set of methods that can be called from mimedefang-filter(5) to operate on MIME objects.
Author: gbechis
Slug: man_Mail::MIMEDefang::MIME
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::MIME - MIME objects interface methods for email filters

# DESCRIPTION

Mail::MIMEDefang::MIME are a set of methods that can be called
from `mimedefang-filter` to operate on MIME objects.

# METHODS

- collect\_parts

    Method that adds parts to the array `@FlatParts` for flattening.

- takeStabAtFilename ( $entity )

    Makes a guess at a filename for the attachment.  Calls MIME::Head's
    recommended\_filename() method, which tries 'Content-Disposition.filename'and if
    not found, 'Content-Type.name'.

    Returns a MIME-decoded filename, or a blank string if none found.

- find\_part

    Method that returns the first MIME entity of type `$content_type`,
    `undef` if none exists.

- append\_to\_part

    Method that appends text to `$part`

- remove\_redundant\_html\_parts

    Method that rebuilds the email message without redundant HTML parts.
    That is, if a multipart/alternative entity contains text/plain and text/html
    parts, the text/html part will be removed.

- append\_to\_html\_part

    Method that appends text to the spicified mime part, but does so by
    parsing HTML and adding the text before &lt;/body> or &lt;/html> tags.

- append\_text\_boilerplate

    Method that appends text to text/plain part or parts.

- append\_html\_boilerplate

    Method that appends text to text/html part or parts.
    It tries to be clever and inserts the text before the &lt;/body> tag
    to be able of being seen.

- anonymize\_uri

    Anonymize urls by removing all utm\_\* parameters,
    takes the message part as parameter and returns
    a boolean value if the sub succeeded or not.
