CREATE INDEX esd_postcode_code_index ON esd_postcode (code);

INSERT INTO esd_postcode
SELECT * FROM ServiceDirectory.esd_postcode;
INSERT INTO esd_link
SELECT * FROM ServiceDirectory.esd_link;