CREATE DATABASE `oruk_validation` /*!40100 DEFAULT CHARACTER SET latin1 */;

CREATE TABLE `account` (
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `feed` (
  `url` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `summary` varchar(2000) NOT NULL DEFAULT '',
  `organisation_label` varchar(255) NOT NULL,
  `organisation_url` varchar(255) NOT NULL DEFAULT '',
  `developer_label` varchar(255) NOT NULL DEFAULT '',
  `developer_url` varchar(255) NOT NULL DEFAULT '',
  `service_path_override` varchar(255) DEFAULT NULL,
  `schema_type` varchar(255) DEFAULT NULL,
  `last_check` datetime NOT NULL DEFAULT '2010-01-01 00:00:00',
  `check_is_running` bit(1) NOT NULL DEFAULT b'0',
  `time_taken` bigint(11) NOT NULL DEFAULT '-1',
  `is_up` bit(1) NOT NULL DEFAULT b'0',
  `is_services_valid` bit(1) NOT NULL DEFAULT b'0',
  `services_message` varchar(2000) DEFAULT NULL,
  `is_service_example_valid` bit(1) NOT NULL DEFAULT b'0',
  `service_example_identifier` varchar(255) DEFAULT NULL,
  `service_example_message` varchar(2000) DEFAULT NULL,
  `is_search_enabled` bit(1) NOT NULL DEFAULT b'0',
  `search_enabled_message` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `feed_filter` (
  `url` varchar(255) NOT NULL,
  `filter` varchar(255) NOT NULL,
  PRIMARY KEY (`url`,`filter`),
  KEY `fk_filter_identifier_idx` (`filter`),
  CONSTRAINT `fk_feed_url` FOREIGN KEY (`url`) REFERENCES `feed` (`url`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_filter_identifier` FOREIGN KEY (`filter`) REFERENCES `filter` (`identifier`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `filter` (
  `identifier` varchar(255) NOT NULL,
  PRIMARY KEY (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `registered_organisation` (
  `private_email_address` varchar(500) NOT NULL,
  `organisation_name` varchar(500) NOT NULL,
  `organisation_type` varchar(500) NOT NULL,
  `adoptation_stage` varchar(500) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `public_email_address` varchar(500) DEFAULT NULL,
  `date_registered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`private_email_address`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `registered_user` (
  `email_address` varchar(500) NOT NULL,
  `date_registered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email_address`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
