Title: Why is SpamAssassin not found even though it is installed?
Date: 2021-07-14 18:40:30
Category: faq
Num: 004
Status: published

**Symptom**: When you build MIMEDefang, it detects SpamAssassin just fine. But when you run it, it doesn’t seem to find the SpamAssassin Perl modules.

**Probable Cause**: This is often caused by a permissions problem. Make sure all of the SpamAssassin Perl modules and data files are world-readable.

**Underlying Cause**: What made the file permissions wrong in the first place? Some installation scripts will explicitly change the permissions on all files they install.  
Others will just create the files, meaning they get created with whatever are the default permissions for the user.  
Since most installs are done by root, you need to look at root’s `umask` setting to see what the default permissions are.
