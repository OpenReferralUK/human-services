CREATE FULLTEXT INDEX service_search ON service(`name`, description);
CREATE FULLTEXT INDEX service_name_search ON service(`name`);
CREATE FULLTEXT INDEX service_description_search ON service(`description`);
CREATE FULLTEXT INDEX taxonomy_search ON taxonomy(`name`);