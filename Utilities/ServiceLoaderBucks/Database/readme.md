# Database creation and validation scripts
The scripts are designed for a MySQL database.

The service_directory_structure.sql will create the structure of the database. If the database already exists then it will be recreated and all existing data will be lost.

Once data has been loaded you can check its validity by running service_directory_validation.sql on the database. This will check that required fields have actually been populated and not left blank. It will also check that data has a valid value where there is an enumerated list of allowed values. Any problems will be shown in the query output. Note that there may be fields which have been intentionally left blank as the data wasn't available. In this case it would be best to create a version of the script which doesn't check those fields.
