---
layout: default
title: Use of Taxonomies
permalink: /UseOfTaxonomies/
---
# Use of Taxonomies with OpenCommunity services data
{:.no_toc}
#### Contents
{:.no_toc}
* TOC 
{:toc}  
## Purpose

This guidance describes how the Open Referral UK data schema for services (the Schema) and the associated API standard supports use of taxonomies. It indicates how taxonomies can be used to tag services and help target searches.

## What is a taxonomy?

A taxonomy (also known as a vocabulary, a concept scheme or just a list of terms) defines terms used to describe a subject area. Each term (also known as a concept or list item) has an identifier, a label and other properties, which may include alternative labels.

Inherited from the Open Referral standard, the Schema uses the the word "taxonomy" to describe a taxonomy term and "vocabulary" to describe the whole taxonomy.

## Candidate taxonomies for services data

### Service types

The schema (and the base Open Referral standard on which it is built) allows for any number of taxonomy terms to be associated with each service entry. Typically such terms will be drawn from vocabularies that describe types of service.

These vocabularies are suitable for describing service types:

-   The LGA's [Services List](http://id.esd.org.uk/list/services) - a list of types of service relevant to English local government. It includes, as a subset, the [Local Government Services List](http://id.esd.org.uk/list/englishAndWelshServices) which is a detailed list of service types that English local authorities are required or empowered to deliver according to UK legislation. The list is mapped against the needs and circumstances of people whom these services might be particularly suitable.

-   OpenActive [Activity List](https://openactive.io/activity-list/activity-list.jsonld) - a list of types of sports and wellbeing activity

-   [Snowmed Clinical Terminologies](http://www.snomed.org/) (see also [here](https://termbrowser.nhs.uk/?perspective=full&conceptId1=404684003&edition=uk-edition&release=v20191001&server=https://termbrowser.nhs.uk/sct-browser-api/snomed&langRefset=999001261000000100,999000691000001104))- a list of clinical terms which can be associated with clinical services

-   [OpenEligibility list](https://github.com/auntbertha/openeligibility/blob/master/taxonomy) - described as a "way to categorize human services and human situations", the human services part of this list provides broad categorisations of service types

### Eligibility

The Schema extends the international Open Referral standard to allow definition of the types of individual eligible for a service.

These vocabularies are suitable for describing eligibility types:

-   The LGA's [Eligibility Circumstances List](http://id.esd.org.uk/list/circumstancesEligibility) - a subset of all circumstances defined by the LGA. Many of the circumstances correspond with those used by the UK Office for National Statistics and other public organisations for classifying statistics. Hence service provision can be correlated with statistics pertaining to specific communities

-   [OpenEligibility list](https://github.com/auntbertha/openeligibility/blob/master/taxonomy) - described as a "way to categorize human services and human situations", the human situations part of this list provides broad categorisations of types of individual

### Accessibility for disabilities

The Schema currently only provides for a limited set of accessibility entries. Proposals have been made ([see here](https://docs.google.com/document/d/15Z-gVDXG9_mOQc2_cjZuzWiKLncpJku03qkbxcDNsos/edit?usp=sharing)) for switching to use of taxonomies for accessibility terms.

This vocabulary may be considered describing service types:

-   OpenActive [accessibility support taxonomy](https://openactive.io/accessibility-support/accessibility-support.jsonld)

We are currently trying to identify a fuller vocabulary.

### Circumstances

The Schema does not make explicit provision for recording the circumstances of users for whom a service is suitable. However user circumstances are relevant in two ways:

-   They can be recorded against services to indicate intended audience for services

-   They can be mapped against service types so services of types relevant to a user's circumstances can be found

These vocabularies are suitable for describing circumstance types:

-   The LGA's [Personal Circumstances List](http://beta.id.esd.org.uk/list/circumstancesPersonal) - a subset of all circumstances defined by the LGA. Many of the circumstances correspond with those used by the UK Office for National Statistics and other public organisations for classifying statistics. Hence service provision can be correlated with statistics pertaining to specific communities.

-   [OpenEligibility list](https://github.com/auntbertha/openeligibility/blob/master/taxonomy) - described as a "way to categorize human services and human situations", the human situations part of this list provides broad categorisations of types of individual

The LGA's Personal Circumstance List is mapped against its Service Types List to show which types of service might be suitable for someone with specific circumstances.

### Needs

The Schema does not make explicit provision for recording the needs of users for whom a service is suitable. However needs can be mapped against service types so services of types relevant to a user's needs can be found.

This vocabulary is suitable for describing needs:

-   The LGA's [Needs List](http://id.esd.org.uk/list/needs) - this is mapped against the LGA's Service Types List to show which types of service might be suitable for someone with specific needs.

## Tagging service directory records

### What to tag with terms from taxonomies

So that searches for services can be well targeted, it is useful to tag each service with one or more service types and with any relevant eligibility terms.

Personal circumstances can sometimes be assigned to services to denote "intended audience".

It should not be necessary to tag individual services with the needs and circumstances of potential users. These can be derived from mappings to service types built into service finder and/or service directory software, as described below.

### Syntax for use of taxonomy terms

Use a [CURIE](https://www.w3.org/TR/2010/NOTE-curie-20101216/) (or Compact URI) as a kind of namespace to identify from which vocabulary a term comes.

Examples:

A local vocabulary, such as Bristol City Council's service types list, has

-   CURIE:  bccservicetype

-   Sample taxonomy term identifier: bccservicetype:78 (for Autism)

The LGA's electronic service delivery list of service types has

-   CURIE: esdServiceType

-   Sample taxonomy term identifier: esdServiceType:242 (for "Care at home")

OpenCommunity will establish a register of CURIEs that have a common meaning across community members. Where a CURIE references a taxonomy with a formal URI, the register will give the taxonomy's URI and the URI prefix for individual taxonomy terms.

### CURIEs to use

All directories should use these CURIEs for national/international vocabularies:

-   esdCircumstance: - the LGA's [Circumstances List](http://id.esd.org.uk/list/circumstances) from "electronic service deliver" work. We'd normally only expect this to be used for service eligibility

-   esdNeed: the LGA's [Needs List](http://id.esd.org.uk/list/needs) from "electronic service deliver" work. We would not normally expect this to be used to tag individual records

-   esdServiceType: - the LGA [Services List](http://id.esd.org.uk/list/services) from "electronic service deliver" work

-   openEligibility: - [OpenEligibility list](https://github.com/auntbertha/openeligibility/blob/master/taxonomy)  of "human services" and "human situations"

-   openActiveActivity: - OpenActive [Activity List](https://openactive.io/activity-list/activity-list.jsonld) 

-   snomedCT: - [Snomed Clinical Terminologies](http://www.snomed.org/) (see also [here](https://termbrowser.nhs.uk/?perspective=full&conceptId1=404684003&edition=uk-edition&release=v20191001&server=https://termbrowser.nhs.uk/sct-browser-api/snomed&langRefset=999001261000000100,999000691000001104))

Publishers are free to devise their own CURIEs for local lists. They may use the authority name abbreviated eg "BCC:" or "Bristol:", "Hull:".

We normally expect CURIEs to be in the singular, so  "esdServiceType", not "esdServiceTypes".

## Targeting services at specific user groups

The Schema and, in particular, its extensions to Open Referral is designed to target quite accurately the services relevant to someone who is searching a directory.

You can store information and search according to:

-   Text, which may be drawn from a service's name and description with whatever relevance prioritisation a search engine deploys

-   Minimum and maximum ages of service users

-   The geographical scope for which service users are eligible, eg residents of a given borough

-   Taxonomy terms associated with each service

The Schema supports use of any given taxonomy, including taxonomies local to an installation as well as national and international ones, such as those given above.

### Using taxonomies with the API

The standard API's web method for getting services is defined [here](https://api.porism.com/ServiceDirectoryService/swagger-ui.html#/Services/getServicesUsingGET).

It includes filter parameters for:

-   text - used for a general text search of service name and other fields implemented by the service directory search engine

-   minimum_age

-   maximum_age

-   coverage - for checking the any service area eligibility criteria

-   postcode and proximity - for limiting service found to those within a given proximity of the centroid of a specific postcode

-   taxonomy_type, vocabulary and taxonomy_id

The taxonomy search looks for a given taxonomy term (eg [service type 298 - Carers support groups](http://id.esd.org.uk/service/298)) from a given vocabulary (eg the [LGA's Service Types list](http://id.esd.org.uk/list/services)) associated with a particular type of data (eg service, service eligibility, organization).

Hence this call is used to find all services of service type 298 in the LGA Service Type list:

/services/?taxonomy_id=esdServiceType:242&taxonomy_type=service&vocabulary=esdServiceTypes

Note that all the above filter parameters are applied with a Boolean AND operator. Hence the above syntax cannot be used to find services with one of a number of given service types via a single API call.

### Selecting services for particular service types, circumstances and needs

The service_type, circumstance and need parameters are special calls implemented by some instances of the services API to allow selection using a Boolean AND of taxonomy terms.

These parameters allow arrays of service type, need and circumstance identifiers from the LGA's taxonomies to be called.

Hence:

/services/?service_types=esdServiceType:298service_types=esdServiceType:1755 finds services of types [298 - Carers support groups](http://id.esd.org.uk/service/298) and/or [1755 - Carers assessment](http://id.esd.org.uk/service/1755).

/services/?circumstance=esdCircumstance:Gender_Female&circumstance=esdCircumstance:AddictSubstanceAbuser_Smoking finds services of types associated with circumstance [Gender_Female - Female](http://id.esd.org.uk/circumstance/Gender_Female) and/or [AddictSubstanceAbuser_Smoking - Smoker](http://id.esd.org.uk/circumstance/AddictSubstanceAbuser_Smoking).

/services/?need=esdNeed:69&esdNeeds=need:71 finds services of types associated with needs [69 - Social inclusion](http://id.esd.org.uk/need/69) and/or [71 - Community facilities](http://id.esd.org.uk/need/71)

### Personas

Service Finder utilities can be configured to filter services according to their target groups.

The sample [service finder here](https://opencommunity.porism.com/ServiceFinder) (see [here for source code](https://github.com/esd-org-uk/human-services/tree/master/ServiceFinder)) illustrates how "personas" can be used for quick filtering according to target groups.

![ServiceFinder homepage](https://raw.githubusercontent.com/OpenReferralUK/human-services/gh-pages/assets/images/ServiceFinderPage.png)

A Service Finder tool can either be with a set of service types applicable to the personas it supports or configured directly with the needs as circumstances associated with those personas, as described below.

### Configuring personas with service types

Owners of service finder tools are usually best placed to understand the service types that are applicable to the personas of their audience. These may come from one or more service type vocabularies. The service types chosen may be informed by external mappings, such as those maintained by the LGA from lists of needs and circumstances.

A JSON configuration of a persona by service types might look like this:

```json
"persona": [{
  "value": 0,
  "label": "Lonely",
  "data": {
    "service_types": [
      "esdServiceType:1149", "esdServiceType:296", "esdServiceType:297", "Snowmed:228553007", "OAActivity:angling"
    ]
  }
},
```

### Configuring personas with needs and service types

Some service directories may implement means of making API queries for a specified list of needs and/or circumstances. In such cases, the directory itself needs to host and maintain mappings from needs and circumstances to service types.

The LGA's illustrative open source service directory does this usings mappings from LGA defined needs and circumstances to LGA service types. Hence the illustrative open source service finder can configure personas based on needs and circumstances, relying on the directory to lookup service types and retrieve corresponding services.

The service finder's [config.js](https://github.com/OpenReferralUK/ServiceFinder/blob/master/src/config.js) JSON format file gives named sets filter criteria to be applied to a search for services. The example below shows how it associates the "Lonely" persona with relevant needs and circumstances.

```json
"persona": [{
  "value": 0,
  "label": "Lonely",
  "data": {
    "needs": [
      "69", "71", "111", "115", "67", "36", "66", "68"
    ],
    "circumstances": [
      "Gender_Female", "AddictSubstanceAbuser_Smoking"
    ]
  }
},
```

## Referencing Local Government Association taxonomies and mappings

The LGA supports these relevant taxonomies:

-   Service types - <http://id.esd.org.uk/list/services> with mappings from personal circumstances and needs

-   Needs - <http://id.esd.org.uk/list/needs> with mappings to service types

-   Personal circumstances - [http://id.esd.org.uk/list/circumstancesPersonal](http://beta.id.esd.org.uk/list/circumstancesPersonal)  with mappings to service types

-   Eligibility circumstances - [http://id.esd.org.uk/list/circumstancesEligibility](http://beta.id.esd.org.uk/list/circumstancesEligibility)

The URIs for these taxonomies and for their taxonomy items resolve to web pages where more information can be found, including a "Downloads" tabbed page for each list and each mapping to another list in CSV of XML format. Signed in users of the standards pages can subscribe to any list and so be informed of updates and consulted on major changes.

The content of lists and their mappings can be also be obtained in JSON format via the LG Inform Plus API, specifically these web methods:

-   [/lists](https://developertools.esd.org.uk/methods#docs-lists) - giving the properties of all LGA taxonomies (lists) and their subsets

-   [/lists/{listId}](https://developertools.esd.org.uk/methods#docs-listslistId) - giving the full properties of a single taxonomy (list) and all its items

-   [/lists/{listId}/verbose](https://developertools.esd.org.uk/methods?docs-listslistIdverbose#docs-listslistIdverbose) - giving the full properties of a single taxonomy (list) and all its items and their mappings to all other lists

-   [/lists/{listId}/{identifier}](https://developertools.esd.org.uk/methods#docs-listslistIdidentifier) - full properties of a single taxonomy (list) item

## Taxonomies to describe service coverage
"Service areas" define the geographical polygons for coverage of services. They are particularly useful for denoting where a service is limited to residents of a particular area (eg a local authority boundary) irrespective as to how close the service is to a potential user.

UK geographies can be referenced by URIs from UK geographies can be referenced in [ONS statistical geographies](http://statistics.data.gov.uk/home). Geographies anywhere in the world that are not represented by ONS geographies can be referenced in [Natural Neighbourhoods](https://neighbourhoods.esd.org.uk/) where you can add your own areas if necessary. Each area has a polygon, represented in GeoJSON, which should be recorded the the service_area.extent field.

Searches on coverage take a postcode as a parameter and return services where the centroid of the given postcode falls within the service area (or where no service area is defined).

Eg, /services?coverage=BS3 4AQ

## Querying APIs by taxonomy terms


The standard API's [web method for getting services](https://api.porism.com/ServiceDirectoryService/swagger-ui.html#/Services/getServicesUsingGET) provides a syntax for retrieving services that correspond with a given taxonomy term.

The syntax is:

/services/?&taxonomy_id=TaxonomyTerm&taxonomy_type=TaxonomyType&vocabulary=VocabularyIdentifier

Where:

-   TaxonomyTerm is term identifier prefixed by its CURIE, eg esdServiceType:242

-   TaxonomyType is one of Area, Cost, Eligibility, Organization, Service or "Any" representing any of these

-   VocabularyIdentifier is the vocabulary from which the term comes

### Querying multiple taxonomy terms

The current API syntax doesn't explicitly support Boolean OR operators alone or mixed with AND operators.

These are the optional approaches to supporting more flexible operators:

1.  Make multiple calls to the API (which uses the AND operator) and combine the results in the client application

2.  Add a syntax for combining taxonomy terms to the API. This might be done with these parameters: 

1.  Taxonomy type (eg service, eligibility, ...)

2.  Operator (AND or OR) defaulting to AND

3.  List of taxonomy terms to query

Eg /services/?taxonomy_query_type=service&taxonomy_query_operator=OR&taxonomy_query_identifiers=esdServiceType:1149,esdServiceType:296, esdServiceType:297,Snowmed:228553007,OAActivity:angling  

1.  Provide a syntax for defining parameters to be submitted via an HTTP POST - this is strictly not a RESTful approach

2.  Provide a string of query parameters that can be submitted via an HTTP GET

