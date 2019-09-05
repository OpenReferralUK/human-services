rmdir /s /q Export
md Export

Generator.exe --type=html --filter=0 --verbose=1 --output=Export\
Generator.exe --type=csv --filter=2 --verbose=0 --ref=service --title=service.schema --output=Export\
Generator.exe --type=csv --filter=2 --verbose=1 --ref=service --title=service.schema.verbose --output=Export\
Generator.exe --type=csv --filter=2 --verbose=0 --ref=location --title=location.schema --output=Export\
Generator.exe --type=csv --filter=2 --verbose=1 --ref=location --title=location.schema.verbose --output=Export\
Generator.exe --type=csv --filter=2 --verbose=0 --ref=review --title=review.schema --output=Export\
Generator.exe --type=csv --filter=2 --verbose=1 --ref=review --title=review.schema.verbose --output=Export\
Generator.exe --type=csv --filter=2 --verbose=0 --ref=organization --title=organization.schema --output=Export\
Generator.exe --type=csv --filter=2 --verbose=1 --ref=organization --title=organization.schema.verbose --output=Export\
Generator.exe --type=table --filter=2 --verbose=0 --ref=service --title=service.tableschema --output=Export\
Generator.exe --type=table --filter=2 --verbose=1 --ref=service --title=service.tableschema.verbose --output=Export\
Generator.exe --type=table --filter=2 --verbose=0 --ref=location --title=location.tableschema --output=Export\
Generator.exe --type=table --filter=2 --verbose=1 --ref=location --title=location.tableschema.verbose --output=Export\
Generator.exe --type=table --filter=2 --verbose=0 --ref=review --title=review.tableschema --output=Export\
Generator.exe --type=table --filter=2 --verbose=1 --ref=review --title=review.tableschema.verbose --output=Export\
Generator.exe --type=table --filter=2 --verbose=0 --ref=organization --title=organization.tableschema --output=Export\
Generator.exe --type=table --filter=2 --verbose=1 --ref=organization --title=organization.tableschema.verbose --output=Export\
Generator.exe --type=json --filter=2 --verbose=0 --ref=service --title=service.schema --output=Export\
Generator.exe --type=json --filter=2 --verbose=1 --ref=service --title=service.schema.verbose --output=Export\
Generator.exe --type=json --filter=2 --verbose=0 --ref=location --title=location.schema --output=Export\
Generator.exe --type=json --filter=2 --verbose=1 --ref=location --title=location.schema.verbose --output=Export\
Generator.exe --type=json --filter=2 --verbose=0 --ref=review --title=review.schema --output=Export\
Generator.exe --type=json --filter=2 --verbose=1 --ref=review --title=review.schema.verbose --output=Export\
Generator.exe --type=json --filter=2 --verbose=0 --ref=organization --title=organization.schema --output=Export\
Generator.exe --type=json --filter=2 --verbose=1 --ref=organization --title=organization.schema.verbose --output=Export\
Generator.exe --type=gv --filter=0 --verbose=1 --title=all --output=Export\
Generator.exe --type=gv --filter=1 --verbose=1 --title=openreferral --output=Export\
Generator.exe --type=gv --filter=2 --verbose=1 --title=ap --output=Export\
Generator.exe --type=table --filter=0 --verbose=1 --title=all.tableschema --output=Export\
Generator.exe --type=table --filter=1 --verbose=1 --title=openreferral.tableschema --output=Export\
Generator.exe --type=table --filter=2 --verbose=1 --title=ap.tableschema --output=Export\