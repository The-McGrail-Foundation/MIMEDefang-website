Title: When I add a To: header, why doesn't the recipient receive a copy of the e-mail?
Date: 2021-07-14 18:40:30
Category: faq
Description: Adding or changing the To: header with action_add_header does not redirect mail; use add_recipient/delete_recipient to change the actual destination.
Num: 007
Audience: admin
Status: published

**Symptom**: I used `action_add_header` to add a new “To:” (or “Cc:” or “Bcc:”) field to a message,  
or used `action_change_header` to change the “To:” field, but the message didn’t go where I thought it should.

**Cause**: Changing headers does *not* change the destination of the email message.  
That is controlled by the envelope recipient(s) in the SMTP dialog.  
You will have to use `add_recipient` and/or `delete_recipient` to change the destination for a message.
