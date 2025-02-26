Title: Mail::MIMEDefang::MIME (3) - man page
Description: Mail::MIMEDefang::MIME are a set of methods that can be called from mimedefang-filter(5) to operate on MIME objects.
Author: gbechis
Slug: man_Mail::MIMEDefang::MIME
Status: published
Template: documentation

# NAME

Mail::MIMEDefang::MIME - MIME objects interface methods for email
filters

# DESCRIPTION

Mail::MIMEDefang::MIME are a set of methods that can be called from
*mimedefang-filter* to operate on MIME objects.

# METHODS

collect_parts

:   Method that adds parts to the array `@FlatParts` for flattening.

takeStabAtFilename ( $entity )

:   Makes a guess at a filename for the attachment. Calls MIME::Head's
    **recommended_filename()** method, which tries
    'Content-Disposition.filename'and if not found,
    'Content-Type.name'. Returns a MIME-decoded filename, or a blank
    string if none found.

find_part

:   Method that returns the first MIME entity of type `$content_type`,
    `undef` if none exists.

append_to_part

:   Method that appends text to `$part`

remove_redundant_html_parts

:   Method that rebuilds the email message without redundant HTML parts.
    That is, if a multipart/alternative entity contains text/plain and
    text/html parts, the text/html part will be removed.

append_to_html_part

:   Method that appends text to the spicified mime part, but does so by
    parsing HTML and adding the text before </body> or </html> tags.

append_text_boilerplate

:   Method that appends text to text/plain part or parts.

append_html_boilerplate

:   Method that appends text to text/html part or parts. It tries to be
    clever and inserts the text before the `</body>` tag to be able of
    being seen.

anonymize_uri

:   Anonymize urls by removing all utm\_\* parameters, takes the message
    part as parameter and returns a boolean value if the sub succeeded
    or not.
