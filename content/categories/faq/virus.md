Title: I didn't send a virus -- why does your software claim I did?
Date: 2021-07-14 18:40:30
Category: faq
Description: Why you may be blamed for sending a virus you didn't send - viruses forge sender addresses, and MIMEDefang does not notify forged senders by default.
Num: 015
Audience: enduser
Status: published

Many viruses forge the sender’s address. By default, MIMEDefang does *not* send notifications to virus senders for this very reason.  
We strongly recommend to MIMEDefang administrators that they do not change this behaviour.

However, some MIMEDefang administrators insist on sending notifications to the apparent sender of a virus.  
This is bad behaviour, but we *cannot* control it. Complain to the ISP in question, or blacklist it until it fixes the configuration.
