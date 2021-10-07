# Open Referral UK API Validation Rules

This document summarises the checks performed on Open Referral UK Application Programming Interface (API) endpoints by the [Validator tool](https://validator.openreferraluk.org/) and by daily checks used to populate settings in the [Dashboard of API feeds](https://openreferraluk.org/dashboard).

Validation is performed against the specified data structure (as described in the [Guidance](https://developers.openreferraluk.org/Guidance/)) and API specification (see the [Swagger documentation](https://api.porism.com/ServiceDirectoryService/swagger-ui.html)).


# Level 1 Compliance - Basic checks

When validating an API endpoint the Validator starts with these checks:



* Does the api have a services detail page i.e: /services/{id} ?
* Are the services paginatable i.e: /services?page={nn} ?
* Does it have the required pagination metadata at the start of the JSON payload?
    * Is the totalPages attribute in the metadata a valid integer?

When reading the paginatable services a maximum sample of the first 10 pages is read.

Validation will fail if it does not pass all these checks.


# Extended checks

Next the following tests are performed on all properties in the data structure:



* If required, is the property present?
* Is the property unique, if it is supposed to be unique?
* Does the property have the specified data type?
* If the property is a string, does it conform to the string format specified (if any)?
* If the property should be populated from an enumeration, are values valid within the enumeration?

Failure to pass these tests will result in warnings that can be used to improve the quality of the API’s data.


# Level 2 Compliance

Finally, the validation tests API methods and their parameters needed to support a generic service finder application using the API (as opposed to hosting its own copy of the data).

All tests work by first trying to find suitably rich records against which the [/services web method](https://api.porism.com/ServiceDirectoryService/swagger-ui.html#/Services/getServicesUsingGET)’s query parameters can be tested. For example, to test querying against the maximum_age and maximum_age parameters, the validator will find a service whose eligibility.minimum_age and eligibility.maximum_age properties are populated.

The validator will select the best record on a test-by-test basis with each record having the most appropriate data richness relevant to a particular test. This is determined by the records with the most of the required data for a test, once this is done the test is performed and the results scanned for the expected service.

If multiple service records have the same level of richness then one service is chosen at random from amongst these services. 

To cover all of the API functionality the following five tests are performed each test extracts the required data from the services as it parses them and then performs the associated tests using the API query parameters. All items highlighted in orange don’t take part in the test but are used to determine if the data is valid.


<table>
  <tr>
   <td><strong>Test Name</strong>
   </td>
   <td><strong>Required Data</strong>
   </td>
   <td><strong>API Parameters Involved</strong>
   </td>
  </tr>
  <tr>
   <td>Age Test
   </td>
   <td>
<ul>

<li>eligibility.minimum_age

<li>eligibility.maximum_age
</li>
</ul>
   </td>
   <td>
<ul>

<li>minimum_age

<li>maximum_age
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Postcode Search
   </td>
   <td>
<ul>

<li>physical_address.postal_code
</li>
</ul>
   </td>
   <td>
<ul>

<li>proximity=1000

<li>postcode
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Time Search Test
   </td>
   <td>
<ul>

<li>regular_schedule.valid_from

<li>regular_schedule.valid_to

<li>regular_schedule.opens_at

<li>regular_schedule.closes_at

<li>regular_schedule.byday
</li>
</ul>
   </td>
   <td>
<ul>

<li>start_time

<li>end_time

<li>day
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Taxonomy Test
   </td>
   <td>
<ul>

<li>taxonomy.id

<li>taxonomy.vocabulary
</li>
</ul>
   </td>
   <td>
<ul>

<li>taxonomy_id

<li>vocabulary
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td>Text Test
   </td>
   <td>
<ul>

<li>service.name
</li>
</ul>
   </td>
   <td>
<ul>

<li>text
</li>
</ul>
   </td>
  </tr>
</table>


The proximity search relies on the API converting a given postcode to a point represented by the latitude and longitude of the postcode’s centroid before checking the distance of each service’s latitude and longitude, found in the location table, from that point. (Of course, there could be other valid approaches to achieve the same result.)

The validator reports if each of these tests passes or fails. It also reports if it was unable to perform a test because it could not find a record with properties populated such that a test is possible.


# Completeness checks

At the same time as the validation is performed on the API endpoint a count of every instance of every resource type is performed within the sample limits mentioned above. This is done across the services and all data embedded in those service records.

Here’s a sample output from the completeness check:



* Count of organization: 479
* Count of service: 479
* Count of service_taxonomy: 3908
* Count of service_at_location: 687
* Count of location: 687
* Count of phone: 478
* Count of contact: 479
* Count of physical_address: 687
* Count of postal_address: 0
* Count of regular_schedule: 688
* Count of holiday_schedule: 0
* Count of funding: 0
* Count of eligibility: 269
* Count of service_area: 456
* Count of language: 0
* Count of accessibility_for_disabilities: 1126
* Count of taxonomy: 3908
* Count of cost_option: 458
* Count of review: 1
* Count of link_taxonomy: 0

This count gives an indication as to how richly populated the data is. This can be assessed against the needs of applications intending to use the data.


# Dashboard checks

The [Dashboard](https://openreferraluk.org/dashboard) performs the level one and two validation performed above overnight, for each endpoint.
