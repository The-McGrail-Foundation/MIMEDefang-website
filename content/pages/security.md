Title: Security
Description: How to report a MIMEDefang security vulnerability, where to find published security advisories, signed releases, and how the PMC handles security issues.
Author: gbechis
Slug: security/index
Status: published
Template: pmc

# MIMEDefang Security

## Reporting a vulnerability

Please **do not** report security issues on the public mailing list or in public GitHub issues.

Report suspected vulnerabilities privately through GitHub's
[private vulnerability reporting](https://github.com/The-McGrail-Foundation/MIMEDefang/security/advisories/new).
Your report is visible only to the MIMEDefang maintainers until a fix is released and an advisory is published.

Please include the MIMEDefang version, the MTA in use (Sendmail, Postfix or OpenSMTPD),
and the steps or a sample message needed to reproduce the issue.

## Security advisories

Published advisories are listed on the
[GitHub Security Advisories](https://github.com/The-McGrail-Foundation/MIMEDefang/security/advisories) page of the repository.
Security fixes are also noted in the [Changelog](/documentation/Changelog.html).

## Releases

- The latest release is always available on the [Download](/download/) page, together with its GPG signature.
- All releases are also tagged on [GitHub](https://github.com/The-McGrail-Foundation/MIMEDefang/releases)
  and published on [MetaCPAN](https://metacpan.org/dist/Mail-MIMEDefang).

## Governance

Security issues are handled by the MIMEDefang Project Management Committee (PMC),
which under the [Project Charter](/mimedefang-project-charter/) is responsible for
ethically handling security issues arising from the project's software.
