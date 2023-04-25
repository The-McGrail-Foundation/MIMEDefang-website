Title: Why are my logs filling up with "Milter change: header..." entries?
Date: 2021-07-14 18:40:30
Category: faq
Num: 009
Status: published

**Symptom**: I am running MIMEDefang, but now I am getting a lot of messages in my syslog that look like this:

`Milter change: header MIME-Version: from 1.0 to 1.0`

**Cause**: It is actually the Milter engine of sendmail that is logging all those. To reduce the amount of logging, try putting this line:

`define(\`confMILTER_LOG_LEVEL', \`8')dnl`

in your `sendmail.mc` file and then re-generate your `sendmail.cf`.
