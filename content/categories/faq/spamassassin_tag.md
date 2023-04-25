Title: Why won't SpamAssassin tag a message subject?
Date: 2021-07-14 18:40:30
Category: faq
Num: 008
Status: published

**Symptom**: I configured SpamAssassin to add the spam score to the subject, but it won’t do it.

**Cause**: When you run SpamAssassin under MIMEDefang, SpamAssassin *cannot change the message in any way*.  
If you want to add any spam-related headers, you will have to do this in your rules file (mimedefang-filter).  
Most people seem to do this in `filter_end` (after all parts have been checked for viruses).  
The sample filter has code to call SA and add an X-Spam-Score: header to messages SA tags as spam.

If you want to change the subject, use something like this in `filter_end:`

              action_change_header('Subject', "***SPAM*** $Subject");
