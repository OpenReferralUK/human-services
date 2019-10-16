# ServiceLoader
This is the main folder for the C# code although note that the sln file is in the parent folder. The software is broadly divided into logic, data, and config as detailed below.

## Logic
The main part of the code consists of:

### Program.cs
This is the entry point. It will create a reader to read the API, a writer to write to the database, then loop round each page of results writing to the database.

### ServiceReader.cs
This connects to the API, downloads the results, and deserializes the JSON.

### ServiceWriter.cs
This creates and opens a connection to the database and writes the data returned by the reader. This class does not perform any data conversions and will write whatever data is passed to it. Note that this class implements IDisposable. When finished dispose should be called. The easiest way to do this is with the [using statement](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-statement). A simple example is as follows:

```csharp
using (var writer = new ServiceWriter())
{
  writer.Write(yourData);
}
```

## Data

### Schedule.cs and ScheduleBuilder.cs
Schedule holds details about when the service is held and the builder creates it from the data record

### Taxonomy.cs and TaxonomyBuilder.cs
Taxonomy holds the id, name, and vocabulary for a taxonomy and the builder creates it from the data record

### Mapping files
See folder [JsonMappingObjects](JsonMappingObjects)

## Config

## App.config
Holds the location of the API and the connection string for the database

## NLog.config
Determines how errors are logged
