# Human Services standard and API
## Summary

This repository provides source code, resources and utilities for English extensions to the Open Referral standard for human services data. It contains:

* Proposed extensions to the Open Referral schema
* Application profiles on the extended schema to describe English services
* Data format definitions and proposed vocabularies
* API calls to conforming database applications
* A sample Service Finder application using the API

For the English **[Local Government Association](https://www.local.gov.uk/)** (LGA) pilot work on Loneliness (supporting the Department for Digital, Culture, Media and Sport (DCMS) [Tackling Loneliness Strategy](https://www.gov.uk/government/publications/a-connected-society-a-strategy-for-tackling-loneliness)) we will provide an application profile and API on a database taking data from three pilot local authorities. The blog [Not another directory of services!](https://medium.com/porism/not-another-directory-of-services-a24bb08c6343) describes how the content here fits into the LGA project.

For Open Community alpha work led by **[Buckinghamshire County Council](https://www.buckscc.gov.uk/)**, we will provide an application profile and test approaches recommended by the [OpenCommunity Discovery Report  - The case for a community-based services data standard](https://opencommunity.org.uk/wp-content/uploads/2019/05/Report-OpenCommunity-Data-standards.pdf). We will provide API calls to update data and provide sample data entry tools.

By comparing the two application profiles we can test the viability of moving fast to a single English standard that builds on (and whose core is compatible with) Open referral.

## The approach

The Local Digital Declaration insists on “modular building blocks for the IT we rely on, and open standards to give a common structure to the data we create”. The human service standard is intended to support the modular approach illustrated below.

![Consolidated data feeds queried by service finder applications](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/ConsolidatedDataFeedsQueriedByServiceFinders.png)

Data consumers query service data via an API (see below) from directories that output in a format compliant with the standard. Aggregators take data from compliant directories and merge it to provide more comprehensive data for consuming applications.

The Loneliness project will test taking data from three pilot local authorities and serving it to a sample Service Finder application (to come [here](https://github.com/esd-org-uk/human-services/tree/master/ServiceFinder)). The Project is also testing the usefulness of specific taxonomies and the viability of inferring the types of service most suitable to a user based on their needs and circumstances. We’ll also assess compatibility with the [OpenActive opportunity data model](https://www.openactive.io/modelling-opportunity-data/) and the feasibility of transforming [open active data feeds](https://status.openactive.io/) to be compliant with the services standard.

Open Community work is testing data capture software, de-duplication of merged data and how easily the data can be consumed by applications.

## The standard

The OpenReferral schema defines a structure for human services data. We *extend* the schema to support richer data where prior work indicates it is needed. We *constrain* the resultant schema by means of an *application profile* which says what fields are recommended for English use and what external vocabularies to reference.

![Schema extension and constraint](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Resources/SchemaExtensionAndConstraint.png)

For the LGA/DCMS Loneliness project application profile, these resources describe the schema:

* [Documentation for the application profile](http://htmlpreview.github.io/?https://github.com/esd-org-uk/human-services/blob/master/Schemas/documentation.html) giving each table/class and their fields/properties
* [Tabular data package with extensions and application profiles](https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json)
* [Application profile entity relation diagram](https://github.com/esd-org-uk/human-services/raw/master/Resources/LGA_ApplicationProfileBasicEntityRelationshipDiagram.png)
* JSON schema for a service - [simple](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Schemas/service.schema.json) and [verbose](https://raw.githubusercontent.com/esd-org-uk/human-services/master/Schemas/service.schema.verbose.json)
 
For Open Community alpha work led by Buckinghamshire County Council, we compared the [proposed changes to Open Referral arising from the  discovery phase work](https://opencommunitystandard.github.io/specification/#proposed-changes) with those proposed by LGA work. The document [BUCKS Community Services Data as an Application Profile of Open Referral](https://docs.google.com/document/d/1V88KW7xeGKqO5SP2r_0Mg2Kv_R49ug8_Xv4NqYi2bXw/edit#) details the comparison and resultant application profile changes with a MoSCoW rating. These changes are recorded in machine readable format as a second application profile in the [Tabular data package with extensions and application profiles](https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json). From this we auto-generated:
* [Application profile entity relation diagram for Open community](https://github.com/esd-org-uk/human-services/raw/master/Resources/OpenCommunityApplicationProfileERD.png).

We are assessing the LGA/DCMS and Open Community application profiles against refined user stories, illustrative applications and smaple imported data with aview to recommending a unified schema for English services.

The [SchemaGenerator folder](https://github.com/esd-org-uk/human-services/tree/master/SchemaGenerator) gives more schemas and code for generating them and other resources from a tabular data package.

## The API

An alpha API is being developed to get and post data in the standard format.

Here is [Swagger documentation for the API based on alpha web-sevices](https://api.porism.com/ServiceDirectoryService/swagger-ui.html).  API responses for methods which get services, organizations, etc are in the schema’s JSON format.

Different API endpoints will be supported for different databases. Currently the http://api.porism.com/ServiceDirectoryService/ end point serves historic Bristol services data for illustration with no guarantees on accuracy. A few demonstration services with all properties populated are being added to the end point http://api.porism.com/ServiceDirectoryServiceDemo/.

We’ll provide a tool to help construct API calls and visualise results.

Here are some sample API calls:

* Get all services: http://api.porism.com/ServiceDirectoryService/services/
* Get a service: https://api.porism.com/ServiceDirectoryService/services/01ff53d3-69ed-4d58-8453-20d5295bd208
* Get vocabularies: http://api.porism.com/ServiceDirectoryService/vocabularies/
* Get taxonomy terms in “BCC Age Groups” vocabulary: http://api.porism.com/ServiceDirectoryService/taxonomies/?vocabulary=BCC%20Age%20Groups
* Get services for  “BCC Age Group” vocabulary "bccagegroup:18" taxonomy term (Older People): http://api.porism.com/ServiceDirectoryService/services/?vocabulary=BCC%20Age%20Group&taxonomy_id=bccagegroup:18
* Get taxonomy terms in “esdServiceTypes” vocabulary: http://api.porism.com/ServiceDirectoryService/taxonomies/?vocabulary=esdServiceTypes  
* Get services for “esdServiceType” vocabulary "http://id.esd.org.uk/service/833" taxonomy term (leaving Hospital): http://api.porism.com/ServiceDirectoryService/services/?vocabulary=esdServiceTypes&taxonomy_id=http://id.esd.org.uk/service/833

The API is freely available for reasonable use for public and private organisations. It is subject to ongoing development and there are no guarantees on its stability or longevity. It may be modified to require credentials in future.

See the [API query tool](http://service-directory-beta.s3-website-eu-west-1.amazonaws.com/) that illistrates some API calls and shows the structure of data found. The page source can be found [here](https://github.com/esd-org-uk/human-services/tree/master/Utilities/ApiDemoSite) and run from anywhere.