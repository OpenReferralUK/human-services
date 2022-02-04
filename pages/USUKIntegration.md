---
layout: default
title: US UK Open Referral Integration
permalink: /US-UK-Integration/
---

# Open Referral US and UK Alignment
{:.no_toc}
* TOC 
{:toc}
From January to March 2022 US and UK developers will define proposals for combining Open Referral (OR) and Open Referral UK (ORUK) so that USA, UK and other communities are able to work with the same tools, share learning and, if necessary, share data.

The work will comprise three parts:

# 1. Human Services Data Structure (HSDS)
We plan to combine the HSDS 2.1.0 and the UK structure into one “extended” data structure and provide an automated means of generating “application profiles” from that extended structure. Application profiles will include a basic core structure, the current “classic” HSDS, the UK structure and others that may be created over time to meet the needs of specific applications.

<p style="text-align: center;">
    <img src="https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/HSDS_OpenReferral_US_Transparent.png" alt="HSHS with UK extensions and extended" class="img-fluid">
</p>

We don’t expect any backwards incompatibilities with current structures, but we may exclude parts of the UK structure that have not yet been adopted. We may add small uncontentious properties.

# 2. Human Services Data Application Programming Interface (HSDA)
Based on the UK implementation, we’ll define a core API that should work with any Open Referral implementation and be suitable for use with generic tools developed for standard data feeds. There will be an automated means of generating response formats to core GET web methods for all (existing and future) application profiles.

This API specification will be tested in a pilot implementation with one of Open Referral’s community partnerships in which Sarapis is a technical partner. 

# 3. The Community
We’ll bring together the communities by standardising our means of communication and retiring channels that aren’t well used. This will allow us to share learning internationally. There will remain space for discussing matters that only apply in one country.

# How to Get Involved
We’ll share progress via this page and [this forum thread](https://forum.openreferraluk.org/t/closer-alignment-between-international-and-uk-data-structures/134). Updates will also be shared in Open Referral’s Slack, and Github repositories as relevant. Our standard mailings will advise progress.

**[Register here](https://forms.gle/xxgNGPeahG9URbf86)** if you want to be actively consulted during the alignment work.
