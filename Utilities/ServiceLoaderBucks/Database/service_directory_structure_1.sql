#MUST
ALTER TABLE organization ADD email text;
ALTER TABLE organization ADD legal_status text;
ALTER TABLE organization ADD assured_date datetime;

ALTER TABLE service ADD application_process text;
ALTER TABLE service ADD assured_date datetime;

ALTER TABLE eligibility ADD minimum_age int;
ALTER TABLE eligibility ADD maximum_age int;

ALTER TABLE service_taxonomy ADD eligibility_id varchar(1536);

ALTER TABLE contact ADD email text;
ALTER TABLE contact ADD personal_data boolean;
ALTER TABLE contact ADD sensitive_data boolean;

CREATE TABLE `identifier` (
	id varchar(1536) NOT NULL,
	organization_id varchar(1536),
	service_area_id varchar(1536),
	register text,
	identifier text,
	uri text,
	PRIMARY KEY(id),
	KEY FK_identifier_organization (organization_id),
	KEY FK_identifier_service_area (service_area_id),
	CONSTRAINT FK_identifier_organization FOREIGN KEY (organization_id) REFERENCES organization (id),
	CONSTRAINT FK_identifier_service_area FOREIGN KEY (service_area_id) REFERENCES service_area (id)
);

#SHOULD
ALTER TABLE physical_address
ADD uprn text;

ALTER TABLE contact ADD department text;

ALTER TABLE phone ADD extension text;
ALTER TABLE phone ADD description text;

