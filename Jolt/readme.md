This Jolt example reduces [Open Referral extended data package](https://raw.githubusercontent.com/OpenReferralUK/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json) to a simpler version with just three main tables.

This may not be the full solution. The transform is done by a  Java app. That app that does this can be found here: https://github.com/OpenReferralUK/human-services/tree/master/Jolt/Jolt

java -jar Jolt.jar -i "https://raw.githubusercontent.com/OpenReferralUK/human-services/master/SchemaGenerator/Generator/ExtendedDataPackage.json" -o "output.json" -s "https://raw.githubusercontent.com/OpenReferralUK/human-services/master/Jolt/Jolt/src/main/resources/spec.json"

The parameters of the Jolt app are as follows

 - i = the extended data package URL
 - s = the spec URL
 - o = the output URL

A Jolt Spec can be defined like so. In this example spec copies in only the standard attributes and the organization, service and service_taxonomy tables to produce this output.

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
