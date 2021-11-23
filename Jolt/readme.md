In this Jolt example I have reducing the extended data package: https://github.com/OpenReferralUK/human-services/blob/master/Jolt/Jolt/src/main/resources/ExtendedDataPackage.json

This version of the extended data package is embedded in the Jar file to allow the Jar file to easily read the file.

Note that this is not the full solution. The Java app that does this can be found here: https://github.com/OpenReferralUK/human-services/tree/master/Jolt/Jolt

To transform the extended data package a Jolt Spec has to be defined like so:

```` 
[
  {
    "operation": "shift",
    "spec": {
      "@name":"name",
      "@title":"title",
      "@description":"description",
      "@license":"license",
      "@version":"version",
      "@homepage":"homepage",
      "resources": {
        "*": {
          "name": {
            "organization": {
              "@2": "fields[]"
            },
            "service": {
              "@2": "fields[]"
            },
            "service_taxonomy": {
              "@2": "fields[]"
            }
          }
        }
      }
    }
  }
]
````

This spec copies in only the standard attributes and the organization, service and service_taxonomy tables to produce this output: https://github.com/OpenReferralUK/human-services/blob/master/Jolt/Jolt/output.json

The spec, input and output file is specified in the Java close here: https://github.com/OpenReferralUK/human-services/blob/master/Jolt/Jolt/src/main/java/com/openreferral/jolt/Main.java