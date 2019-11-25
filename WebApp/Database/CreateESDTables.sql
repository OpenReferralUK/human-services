CREATE TABLE esd_postcode(
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
code VARCHAR(20) NOT NULL,
latitude double NOT NULL,
longitude double NOT NULL
) 

CREATE TABLE `esd_link` (
  `id` VARCHAR(1536) NOT NULL,
  `taxonomy_id` VARCHAR(1536) NULL,
  `need_id` VARCHAR(1536) NULL,
  `circumstance_id` VARCHAR(1536) NULL,
  PRIMARY KEY (`id`));

