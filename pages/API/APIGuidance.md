---
layout: default
title: API Guidance
permalink: /API-Guidance/
---

## Open Referral UK API Guidance 
{:.no_toc}
* TOC 
{:toc}
This page describes how to conform to and apply the Open Referral UK Application Programming Interface (API).

## API reference

The API a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) API [documented here using Swagger](https://api.porism.com/ServiceDirectoryService/swagger-ui.html) according to the OpenAPI standard.

Use that documentation to look up specific web methods, their parameters and response formats.

## Why use the API standard?

The API allows for services data to be interchanged in a consistent structure between databases and applications. Hence adapters do not need to be developed by each piece of software that needs to process services data.

Developers who learn the API and the Open Referral UK data structure (see [Data Standard Guidance](/Guidance/)) can apply that knowledge to a wide range of applications and data from many sources. Software components using the standard can be interchanged without modification. 

UK local authorities signed up to the [Local Digital Declaration](https://localdigital.gov.uk/declaration/) commit to

> "insisting on modular building blocks for the IT we rely on, and open standards to give a common structure to the data we create"

The Open Referral UK standard facilitates that modular approach for service directories and associated service finder and management tools.

### Using the API for service finder and analysis applications 

In many scenarios it is sufficient to implement the /services web method for single and multiple services.

Directories of services should deliver service data via this web method. Service finders will consume such data.  This page illustrates how you can mix and match different service directories with different service finders - all implementing the /services web methods consistently.

The /vocabularies and /taxonomies methods are also needed if a Service Finder needs to explore what vocabularies/taxonomies and taxonomy terms are used to categorise service data.

Most tools will consume data in the JSON format, but a directory should also support the [CSV format](#json-and-csv) if data is needed for analysis in spreadsheets.

### Validating your data 

The /services/validate POST method checks the validity of records against the schema. It ensures data is in the correct structure and that required fields are present and populated. It does not object to any additional fields beyond those in the specification added for local reasons.

The /services/richness POST method assigns a score to a service record based on how complete the data is. Weightings are given to fields according to their perceived importance. These weightings may vary between API implementations. 

### Importing and exporting service records

For transfer of data between directories, a fuller range of web methods is needed. The response of a GET web method from one directory should POST to another. Of course, in addition to simple transfer of records, provision needs to be made to ensure records from different sources are not duplicated and are of a suotable quality.

## API responses

API GET web method responses conform to JavaScript Object Notation (JSON) schemas. The JSON schemas are derived automatically from the Open Referral UK tabular data structure, as defined in this [tabular data package](https://raw.githubusercontent.com/esd-org-uk/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json).

### Simple and verbose responses

*Simple* schemas define the properties of a class (eg a service) and any other class associated via a many-to-one relationship (eg the organization delivering a service).

*Verbose* schemas also include classes associated via a one-to-many relationship (eg service reviews). The "many" properties are expressed as arrays in JSON and expected to be pipe-delimited in CSV.

Pluralised versions of the JSON schemas define arrays of simple or verbose objects.

#### Examples web methods returning JSON:

<https://api.porism.com/ServiceDirectoryService/services/> returns an array of (the first 50) simple service objects

<https://api.porism.com/ServiceDirectoryService/organizations/> returns an array of (the first 50) simple organization objects

Append "verbose" to the above two calls to get full details of every service/organization returned.

<https://api.porism.com/ServiceDirectoryService/services/000d18bd-f12b-4152-a2fd-9d29f80c90d9>  returns verbose details of a single 

<https://api.porism.com/ServiceDirectoryService/organizations/00329d8f-5d0f-4dec-9040-33587f758a87> returns verbose details of a single organization

The "?include" parameter will add specified properties to the simple objects returned, so for example,

<https://api.porism.com/ServiceDirectoryService/services/?include=service_at_locations> returns (the first 50) services and their locations

### JSON and CSV

By default web methods return data in JSON format compatible with JSON schemas.

However, some APIs support the comma separated values (CSV) format output by appending ".csv" to the web method name.

CSV spreadsheet outputs can be useful for analysing data and feeding it into spreadsheet and business intelligence tools for analysis.

#### Examples web methods returning CSV:

<https://api.porism.com/ServiceDirectoryService/services.csv> returns (the first 50) services in CSV format

<https://api.porism.com/ServiceDirectoryService/services.csv?include=service_at_locations> returns (the first 50) services and their locations in CSV format

## /services web method parameters

The /services web method has additional optional parameters for filtering the services returned. By default, all parameters are combined using the Boolean AND operator.

The Boolean OR operator is used for identifiers within these parameters which take arrays of taxonomy term identifiers:

-   "service_types"
-   "need" - to implement this parameter, a directory needs to use mappings between needs and service types (such as those given by the LGA [here](https://standards.esd.org.uk/?uri=list%2Fneeds&tab=downloads) and in its API) before returning all services of the mapped service types
-   "circumstance" - to implement this parameter, a directory needs to use mappings between circumstances and service types (such as those given by the LGA [here](https://standards.esd.org.uk/?uri=list%2Fcircumstances&tab=downloads) and in its API) before returning all services of the mapped service types

