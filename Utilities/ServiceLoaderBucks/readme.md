# Service loader - API to Database
The service loader connects to the Buckinghamshire service directory API which returns JSON service data and then copies the data to the database. The code is in C# and written with Visual Studio 2017 for .NET Framework v4.6.1. The database is MySQL.

This version of the service loader is written for [Buckinghamshire data](https://bucks-care.herokuapp.com/api/services) but could be easily adapted to read another API returning similar data as JSON.

See [the Database folder](Database) for scripts to create the database structure and to validate the data.

See [the ServiceLoader folder](ServiceLoader) for more information on the code.

## NuGet packages
The packages folder has been omitted from the GitHub repository. To allow the solution to build ensure you have package restore enabled. In Visual Studio choose Tools > NuGet Package Manager > Package Manager Settings. Check the box titled "Allow NuGet to download missing packages". When you next build all packages from the packages.config file should be downloaded.