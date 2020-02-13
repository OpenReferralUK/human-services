---
layout: default
title: Open Referral UK Data Standard Guidance
permalink: /Guidance/
---
# Open Referral UK Data Standard Guidance
{:.no_toc}
#### Contents
{:.no_toc}
* TOC 
{:toc}  
<br>
Version 1.0 This will be the version when it is finalised in March 2020.

## Introduction

This document provides guidance on using the Open Referral UK data standard for locally delivered services.

It is the successor to the Local Government Association's (LGA's) comma separated values (CSV) schema developed by iStandUK and published [here](https://schemas.opendata.esd.org.uk/ServiceDirectory){:target="_blank"} in February 2017. It constitutes the official schema developed in partnership by the LGA and partners involved in the [Local Digital](https://localdigital.gov.uk/)  [OpenCommunity](https://opencommunity.org.uk/) programme.

The Standard conforms to and extends the international [Open Referral](https://openreferral.org/){:target="_blank"} standard.
{% comment %}
The Standard is managed by a community of private, public and third sector organisations governed by an OpenCommunity Board. These details have yet to be determined.
{% endcomment %}
## Purpose

Open Referral UK defines the structure of data expected in interfaces between standards compliant software. It also gives ranges of expected values for some fields.

The standard determines the structure of responses to application programming interface (API) web methods that return service and related data. The [API is defined here](https://api.porism.com/ServiceDirectoryService/swagger-ui.html){:target="_blank"}.

The standard provides for recording sufficient data to be able to identify a small target set of services that closely meet the needs of a prospective service user, as given by the user's location and circumstances.

## Open Referral UK and Open Referral

The OpenReferral schema defines a structure for human services data. Open Referral UK *extends* Open Referral to support richer data where needed. It then *constrains* the resultant schema by means of an *application profile* which says what fields are recommended for English use and what external vocabularies to reference.

[![Schema Extension And Constraint](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/SchemaExtensionAndConstraint.png){:class="img-fluid"}](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/SchemaExtensionAndConstraint.png){:target="_blank"}
  
The application profile reflects user needs identified by LGA work with pilot councils and [proposed changes](https://opencommunitystandard.github.io/specification/#proposed-changes){:target="_blank"} recommended by [OpenCommunity discovery work](https://opencommunity.org.uk/wp-content/uploads/2019/05/Report-OpenCommunity-Data-standards.pdf). The document [Community Services Data as an Application Profile of Open Referral](https://docs.google.com/document/d/16E59vkv2a1khiPHDZJfg00p6ukD1Dhe9z4EJZNxnkzA/edit?usp=sharing){:target="_blank"} assigns MoSCoW (Must, Should, Could, Won't) prioritisations to the proposed changes.

The standard defined here reflects LGA findings combined with "Must have" changes recommended by OpenCommunity.

This Entity Relation Diagram shows the structure of data, distinguishing parts of the core Open Referral standard used from extensions introduced for Open Community.

[![LGA Application Profile Basic Entity Relationship Diagram](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/LGA_ApplicationProfileBasicEntityRelationshipDiagram.png){:class="img-fluid"}{:width="75%"}](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/LGA_ApplicationProfileBasicEntityRelationshipDiagram.png){:target="_blank"}    

{% comment %}
The remaining "should have", "could have" and "won't have" recommendations are shown in the following diagram. They will be introduced in future versions of the standard if there is a business case for doing so. Local implementations may also choose to implement them.

[![LGA Application Profile Basic Entity Relationship Diagram](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/OpenCommunityApplicationProfileERD.png){:class="img-fluid"}{:width="75%"}](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/OpenCommunityApplicationProfileERD.png){:target="_blank"}  
{% endcomment %}
## Data structure

The OpenCommunity standard is defined [here in JSON format](https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json) compliant with the [Open Knowledge Foundation's tabular data package format](https://raw.githubusercontent.com/openreferral/specification/master/datapackage.json){:target="_blank"}.

It comprises:

-   Tables, which may also be seen as classes in a data structure
-   Table fields, which may be seen as class properties
  
Service directories supporting the standard may keep their data in the structure given or may just transform it to that structure for API requests.

Each table and field is described below.


<div id="docs"></div>
<script>
    $(function () {
        $.get("https://raw.githack.com/esd-org-uk/human-services/master/Schemas/documentation.html", function (data) {
            $("#docs").html(data);
            $("#docs table").wrap('<div class="table-responsive"></div>');
        });
    });
    addBackToTop({
        diameter: 42,
        backgroundColor: 'rgb(159,159,158)',
        textColor: '#ffffff'
    });
</script>
