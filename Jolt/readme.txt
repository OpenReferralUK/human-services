In this example we have the extended data package. That is then transformed by the spec:

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

This copies in only the standard attributes and the organization, service and service_taxonomy tables to produce this output: [https://github.com/OpenReferralUK/human-services/blob/master/Jolt/Jolt/output.json]