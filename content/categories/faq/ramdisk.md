Title: How to setup a RAM disk in Linux?
Date: 2021-07-14 18:40:30
Category: faq
Num: 011
Status: published

`/bin/mount -t tmpfs -o size=500m,mode=0700,uid=${md_user},gid=${md_group} /dev/shm $md_spooldir`

`/dev/shm` is provided in most newer Linux systems, maybe `none` works for you, too.

Adjust the size, of course.

Replace `${md_user}` and `${md_group}` with the appropriate UID and GID, in order to give MIMEDefang **write** permission to the directories.

Replace `${md_spooldir}` with the directory specified with the `--with-spooldir=` option during the `./configure` of MIMEDefang.

The idea is to have all temporary files of MIMEDefang been spooled on a very fast RAM disk. None of these files are required after SMTP phase is over. Hence, make sure that `--with-quarantinedir=` points somewhere else!
