Python scripts to convert Bristol data to csv

Requires python 3.6 or higher

python3 script/ConvertWellAwareToOorWithExtensions.py

Python script to import compatible csvs into a database
Add database connection details into script/DataImport.py DataImport.openDb()

Tested in python 3.6
Requires [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)

python3 script/DataImport.py --db {Database to insert into} --path {path to the csvs to import}