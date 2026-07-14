Title: Is there a Docker image available for MIMEDefang?
Date: 2026-06-27 00:00:00
Category: faq
Num: 021
Audience: admin
Status: published

Yes, for Postfix and Sendmail. Official MIMEDefang Docker images are
published on Docker Hub, one per supported MTA:

- [mimedefang/postfix](https://hub.docker.com/r/mimedefang/postfix)
- [mimedefang/sendmail](https://hub.docker.com/r/mimedefang/sendmail)

Pull the latest image:

    docker pull mimedefang/postfix
    docker pull mimedefang/sendmail

The images are suitable for running MIMEDefang in containerized
environments. Refer to the image page on Docker Hub for available tags,
environment variables, and volume mount points.

OpenSMTPD is also a supported MTA, but no Docker image is published for it
yet.
