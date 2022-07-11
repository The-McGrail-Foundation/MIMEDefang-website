Title: MIMEDefang Project Charter
Date: 2021-07-30 19:44
Author: admin_f0tn7wrk
Slug: mimedefang-project-charter
Status: published
Template: pmc


## MIMEDefang Project Charter

### (January 30, 2020)

### 1 **INTRODUCTION**

1.1 MIMEDefang is a GPL licensed framework for filtering e-mail. It uses sendmail's "Milter" API, some C glue code, and some Perl code to let the user write high-performance mail filters in Perl. MIMEDefang can be used to:  
● Block viruses (e.g. using Clamav)  
● Block or tag spam (e.g. using Apache SpamAssassin)  
● Remove HTML mail parts  
● Add boilerplate disclaimers to outgoing mail  
● Remove or alter attachments  
● Replace attachments with URLs  
● Implement sophisticated access controls.  

1.2 This charter briefly describes the mission, history, organization, and processes of the project.  

2 **MISSION**  
2.1 MIMEDefang exists to promote the use of an open source-licensed email filtering tool to write high-performance mail filters in Perl.  

3 **HISTORY  
**  
3.1 MIMEDefang was originally developed by Dianne Skoll, who was contracted by the Royal College of Physicians and Surgeons of Canada in 2000 to help stop the flood of email viruses to the college's network.  
The software was written to filter attachments and was originally called MIMESweeper, then MIMEDefanger and currently MIMEDefang.
Skoll announced her software to the public on August 28, 2000. On December 21, 2001, a version incorporating support for  
Apache SpamAssassin was released, making MIMEDefang a filter for both spam and viruses.  

4 **TERMS  
**  
4.1 The PMC. The Project Management Committee of the MIMEDefang Project.  

4.2 The Project. The MIMEDefang Project; intended to refer to the source code, website and community that are MIMEDefang.  

The MIMEDefang Project is composed of several subprojects, which fit into one of two categories:  
a) Maintaining, enhancing, testing and releasing the main MIMEDefang code distribution – (see https://mimedefang.org/download).  
b) A set of components serving some purpose not directly pertinent to the implementation of MIMEDefang. For example:  
● Reputational Reporting Protocol (https://mimedefang.org/reputation) – a project to develop a system to collect IP reputation  
information about SMTP clients. Interested parties are invited to join in creating a standard protocol for reporting and  
collecting this information.  

4.3 Product. Some deliverable (usually a binary or source package) that the project releases to the public.  

4.4 Contributor. Anyone who makes a contribution to the development of the MIMEDefang project or a subproject.  

4.5 Committer. Each MIMEDefang subproject has a set of committers. Committers are contributors who have read/write access to the source code repository.  

5 **THE PROJECT MANAGEMENT COMMITTEE**  
5.1 The MIMEDefang project is managed by a core group of committers known as the Project Management Committee (“PMC”),  
which is composed of volunteers from among the active committers (see 8.3 below).  

5.2 The activities of the PMC are coordinated by the Chairperson, who is Kevin McGrail (as of the effective date of this Project Charter).  

5.3 The PMC has the following responsibilities:  
a) Facilitating code or other donations by individuals or companies.  
b) Resolving license issues and other legal issues.  
c) Ensuring that administrative and infrastructure work is completed.  
d) Facilitating relationships among subprojects and other infrastructure projects.  
e) Facilitating relationships between MIMEDefang and the external world.  
f) Overseeing MIMEDefang to ensure that the mission defined in this document is  
being fulfilled.  
g) Resolving conflicts within the Project.  
h) Ethically handle security issues arising from software of the Project.  

5.4 Voting shall follow the voting procedures as defined at  
https://www.apache.org/foundation/voting.html unless otherwise overridden in this charter.  

5.5 The PMC is responsible for maintaining and updating this charter as well as publishing it  
on the project website. Development must follow the process outlined below, so any  
change to the development process necessitates a change to the charter. Changes must  
be approved by a vote of the PMC.  

6 **CONTRIBUTORS**  
6.1 The MIMEDefang project is a meritocracy -- the more work you do, the more you are allowed to do.  
Contributions will include participating in mailing lists, reporting bugs, providing patches and proposing changes to a product.  

6.2 Contributors who make regular and substantial contributions may become committers as described below.  

7 **COMMITTERS  
**  
7.1 Committers are contributors who have read/write access to the source code repository or similar project infrastructure.  

7.2 Normally, a new committer is added after a contributor has been nominated by a committer and approved by a vote of the PMC.  
All committers must have a signed Contributor License Agreement (“CLA”) on file with The McGrail Foundation. Since, in  
most cases, contributors will already have contributed significant amounts of code, this should usually have been done before nomination.  

7.3 Committers remain active so long as they are contributing (e.g., writing code, writing documentation, graphics, bug grooming,  
maintaining infrastructure or posting to the project mailing lists).  
If a committer is not active for 3 months, the PMC chair may e-mail the committer and the PMC mailing list notifying the committer  
that they are going to be moved to inactive status.  
If there is no response in 72 hours, the committer will become inactive, and may be removed from the project.  

7.4 An inactive status will not prevent a committer committing new code changes or posting to the mailing lists.  
Either of these activities will automatically re-activate the committer for the purposes of voting.  

8 **INFRASTRUCTURE**  
8.1 The MIMEDefang project relies the following:  
a) Sendmail Milter library.  
b) Website -- The mimedefang.org (https://mimedefang.org/) website will contain  
information about the MIMEDefang project, including documentation, downloads of  
releases, and this charter. Each subproject will have its own website with subproject  
information.  
c) General Mailing List -- This mailing list is open to the public. It is intended for  
discussions that cross subprojects.  
d) The project shall also select a source code repository.  
e) The project shall also select a bug tracking system.  

9 **LICENSING**  
9.1 All contributions to the MIMEDefang project adhere to the v2 version of the General  
Public License (i.e., GPL v2 only, not v3.x or whatever). All further contributions  
must be made under the same terms.  

9.2 When a committer is considering integrating a contribution from a contributor who has no CLA on file with the PMC,  
it is the responsibility of the committer, in consultation with the PMC, to conduct due diligence on the provenance of the  
contribution under consideration.
