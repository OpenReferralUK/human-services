layout: default
title: API Implementation
permalink: /API-Implementation/
---

## Open Referral UK API Implementation 
{:.no_toc}
* TOC 
{:toc}
This page provides programmer note on implementing the Open Referral UK Application Programming Interface (API).

## Security
To make this API as widely used as possible across platforms, especially simple HTML/JavaScript apps, we recommend that you implement the following header on all HTTP responses.

Access-Control-Allow-Origin: *

This will mean that your API can be accessed by tools that run from web pages such as the [API Query Tool](https://tools.openreferraluk.org/ApiQuery/).

## Finding Services

The /services web method supports parameters for filtering the list of services found. This document focuses on some of the core parameters.

### Pagination of Results
As most service directories are quite large, pagination is  important  to efficiently read the directory without putting too much load on the API server.

Pagination requires two parameters: *page* and *per_page* where *page* is the page of results defaulting to 1. *per_page* gives the number of services to show in each page, defaulting to 50.

#### Example call

/services?page=2&per_page=100

### Pagination Payload
The /services web method should include a pagination payload at the beginning of every response. This consists of:

- totalElements - the total number of services matching the search parameters
- totalPages - the total number of pages that can be paginated
- number - the current page of the pagination data that is being viewed
- size - the current number of services in the current page of data
- first - true if this is the first page in the paginated results
- last  - true if this is the last page in the paginated results

#### Example payload
> {
>    "totalElements":3671,
>    "totalPages":3671,
>    "number":2,
>    "size":50,
>    "first":false,
>    "last":false,
>    "content":[
>       {
>          ...
>       }
>    ]
}

### Text Search
The *text* parameter should allow for text within at least a service title and description. The precise operation of a text search will vary betwen implementations, some of which will deplot solr or ElasticSearch and may use symonyms and misspellings.

#### Example test search

/services?text=swimming+lessons

### Proximity Search
A proximity (or distance) search requires two parameters: *postcode* and *proximity*. *postcode* is the location from which the potential service attendee is travelling. *proximity* is the distance from this location in meters the person might reasonably travel. When implementing a postcode search, postcodes should be normalised to ignore spaces.

Use of postcodes requires the search to convert the specified postcode to the longitude and latitude of teh postcode's centroid. If service locations are stored with postcodes, these also need to be converted to longitudes and alttitudes when saved or during a proximity search.

You might expect a search for services by proximity to return each matching service with just its locations that are within the given proximity, not all the service's locations

#### Example proximity search

/services?postcode=SW1W0NY&proximity=5000

### Coverage Search
A coverage search also uses the postcode parameter. It should return services whose sevice coverage boundaries (given by their geographical extents) contain the centroid of the specified postcode. Calls should also include services with no service coverage data indicating that people resident at any postcode are entitled to use them.

Postcode and coverage parameters should be normalised to ignore spaces.

#### Example coverage call

/services?coverage=SW1W0NY

### Age Search
An age search uses the *minimum_age* and/or *maximum_age* parameters to find services that are suitable for the specified age range. Note that both parameters are not required. The minimum_age parameter will search for services that have a minimum age equal to or more than the specified age. While the maximum_age parameter will search for services that have a maximum age equal to or less than the specified age.

IS THIS CORRECT OR SHOULD WE JUST LOOK FO SERVICES SUITABLE FOR A GIVEN AGE?

#### Example age searches

Find services suitable for eighteen to thirty year olds.

/services?minimum_age=18&maximum_age=30

Find services suitable for at least thirty year olds.

/services?minimum_age=30

### Time Search
A time search finds ervices are running at a certain time/day. The search takes three parameters: *start_time*, *end_time* and *day*. Multiple sets of these parameters can be used but there must be the same number of each.

The *start_time* and *end_time* parameters are in the HH:MM format. Where HH is the hours from 00 to 23 and MM is the minutes from 00 to 59.

The *day* parameters represent each day in the following format: SU,MO,TU,WE,TH,FR,SA

This search is done using an OR operator, which means one of the time sets must be matched.

#### Example time searches

An example of a call using multiple sets.

/services?start_time=10:00&end_time=16:00&day=MO&start_time=10:00&end_time=16:00&day=TU

Find all services after 6pm.

/services?start_time=18:00

### Taxonomy Search
Taxonomies are used for consistent classification of services in a way that everyone understand and that allows data to be meaningfully combined from multiple sources. Taxonomies are described more in the [Use of Taxonomies page](https://developers.openreferraluk.org/UseOfTaxonomies/).

There are three parameters required to perform a taxonomy search: *taxonomy_id*, *taxonomy_type* and *vocabulary*. You can search for multiple taxonomy terms at once by specifying a set of taxonomy parameters, but there must be the same number of taxonomy parameters.

If the *taxonomy_id* includes a CURIE then there may be no need to include a vocabulary as it will be sufficiently unique.

If no *taxonomy_type* is specified it should search all taxonomy types: the standard available types are: “organization", "eligibility", "cost_option" and "service_area”

#### Example taxonomy search
/services?taxonomy_id=http://id.esd.org.uk/service/1284&vocabulary=esdServiceTypes
