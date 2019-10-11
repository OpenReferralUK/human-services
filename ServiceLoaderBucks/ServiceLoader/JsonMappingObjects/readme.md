# JSON mapping objects
All the files in this folder show which fields in JSON map to which properties in the C# object. Any property with a JsonProperty attribute maps to a field in the JSON. Any property with a NotMapped attribute does not.

The idea behind the NotMapped attributes is that they are used for data transformations where the data format in JSON doesn't exactly match the database. By doing these in the file all the logic for data mapping between the API and database is in one place and not the responsibility of the writer.
