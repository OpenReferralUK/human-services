Release doc:

https://docs.google.com/document/d/1x9yaHC0t0MBxEA01m2mqyq9KhVNiK12dVGb9B2eTBGQ/edit


/home/ubuntu/

To redeploy code you need to:

validator.openreferraluk.org:

Publish the validator to ...\Release\netcoreapp3.1\publish
sudo systemctl stop ServiceDirectoryValidator.service
Copy the contents of the publish folder over /home/ubuntu/ServiceDirectoryValidator
sudo systemctl start ServiceDirectoryValidator.service
Test validator.openreferraluk.org is up and running

sudo systemctl stop ServiceDirectoryExporter.service
sudo systemctl start ServiceDirectoryExporter.service

https://www.c-sharpcorner.com/article/how-to-deploy-net-core-application-on-linux/
