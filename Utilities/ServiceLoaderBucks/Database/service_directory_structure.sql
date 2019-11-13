CREATE DATABASE  IF NOT EXISTS `ServiceDirectoryBucks` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `ServiceDirectoryBucks`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
-- ------------------------------------------------------
-- Server version	5.7.22-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accessibility_for_disabilities`
--

DROP TABLE IF EXISTS `accessibility_for_disabilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accessibility_for_disabilities` (
  `id` varchar(1536) NOT NULL,
  `location_id` varchar(1536) DEFAULT NULL,
  `accessibility` text,
  PRIMARY KEY (`id`),
  KEY `FK_accessibility_for_disabilities_1` (`location_id`),
  CONSTRAINT `FK_accessibility_for_disabilities_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `name` text,
  `title` text,
  PRIMARY KEY (`id`),
  KEY `FK_contact_1` (`service_id`),
  CONSTRAINT `FK_contact_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cost_option`
--

DROP TABLE IF EXISTS `cost_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cost_option` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL,
  `valid_to` datetime DEFAULT NULL,
  `option` text,
  `amount` decimal(5,2),
  `amount_description` text,
  PRIMARY KEY (`id`),
  KEY `FK_cost_option_1` (`service_id`),
  CONSTRAINT `FK_cost_option_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `eligibility`
--

DROP TABLE IF EXISTS `eligibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eligibility` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `eligibility` text,
  PRIMARY KEY (`id`),
  KEY `FK_eligibility_1` (`service_id`),
  CONSTRAINT `FK_eligibility_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `esd_link`
--

DROP TABLE IF EXISTS `esd_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esd_link` (
  `id` VARCHAR(1536) NOT NULL,
  `taxonomy_id` VARCHAR(1536) NULL,
  `need_id` VARCHAR(1536) NULL,
  `circumstance_id` VARCHAR(1536) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `esd_postcode`
--

DROP TABLE IF EXISTS `esd_postcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `esd_postcode` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1769446 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `funding`
--

DROP TABLE IF EXISTS `funding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `funding` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `source` text,
  PRIMARY KEY (`id`),
  KEY `FK_funding_1` (`service_id`),
  CONSTRAINT `FK_funding_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `holiday_schedule`
--

DROP TABLE IF EXISTS `holiday_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `holiday_schedule` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `service_at_location_id` varchar(1536) DEFAULT NULL,
  `closed` tinyint(1) NOT NULL,
  `opens_at` time DEFAULT NULL,
  `closes_at` time DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_holiday_schedule_1` (`service_id`),
  KEY `FK_holiday_schedule_2` (`service_at_location_id`),
  CONSTRAINT `FK_holiday_schedule_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  CONSTRAINT `FK_holiday_schedule_2` FOREIGN KEY (`service_at_location_id`) REFERENCES `service_at_location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) NOT NULL,
  `language` text,
  PRIMARY KEY (`id`),
  KEY `FK_language_1` (`service_id`),
  CONSTRAINT `FK_language_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `link_taxonomy`
--

DROP TABLE IF EXISTS `link_taxonomy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `link_taxonomy` (
  `id` varchar(1536) NOT NULL,
  `link_type` text NOT NULL,
  `link_id` text,
  `taxonomy_id` varchar(1536) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `taxonomy_id` (`taxonomy_id`),
  CONSTRAINT `link_taxonomy_ibfk_1` FOREIGN KEY (`taxonomy_id`) REFERENCES `taxonomy` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` varchar(1536) NOT NULL,
  `name` text,
  `description` text,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization` (
  `id` varchar(1536) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `url` text,
  `logo` text,
  `uri` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `phone`
--

DROP TABLE IF EXISTS `phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phone` (
  `id` varchar(1536) NOT NULL,
  `contact_id` varchar(1536) NOT NULL,
  `number` text NOT NULL,
  `language` text,
  PRIMARY KEY (`id`),
  KEY `FK_phone_1` (`contact_id`),
  CONSTRAINT `FK_phone_1` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `physical_address`
--

DROP TABLE IF EXISTS `physical_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `physical_address` (
  `id` varchar(1536) NOT NULL,
  `location_id` varchar(1536) DEFAULT NULL,
  `address_1` text NOT NULL,
  `city` text NOT NULL,
  `state_province` text NOT NULL,
  `postal_code` text NOT NULL,
  `country` text NOT NULL,
  `attention` text,
  PRIMARY KEY (`id`),
  KEY `FK_physical_address_1` (`location_id`),
  CONSTRAINT `FK_physical_address_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `regular_schedule`
--

DROP TABLE IF EXISTS `regular_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regular_schedule` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `service_at_location_id` varchar(1536) DEFAULT NULL,
  `opens_at` time DEFAULT NULL,
  `closes_at` time DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL,
  `valid_to` datetime DEFAULT NULL,
  `dtstart` text,
  `freq` text,
  `interval` text,
  `byday` text,
  `bymonthday` text,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `FK_regular_schedule_1` (`service_id`),
  KEY `FK_regular_schedule_2` (`service_at_location_id`),
  CONSTRAINT `FK_regular_schedule_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  CONSTRAINT `FK_regular_schedule_2` FOREIGN KEY (`service_at_location_id`) REFERENCES `service_at_location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `reviewer_organization_id` varchar(1536) DEFAULT NULL,
  `title` text,
  `description` text,
  `date` datetime DEFAULT NULL,
  `score` text,
  `url` text,
  `widget` text,
  PRIMARY KEY (`id`),
  KEY `FK_review_1` (`service_id`),
  KEY `FK_review_2` (`reviewer_organization_id`),
  CONSTRAINT `FK_review_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  CONSTRAINT `FK_review_2` FOREIGN KEY (`reviewer_organization_id`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service` (
  `id` varchar(1536) NOT NULL,
  `organization_id` varchar(1536) NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `url` text,
  `email` text,
  `status` text NOT NULL,
  `fees` text,
  `accreditations` text,
  `deliverable_type` text,
  `assured_date` datetime,
  `attending_type` varchar(20),
  `attending_access` varchar(20),
  `parent_id` varchar(1536),
  PRIMARY KEY (`id`),
  KEY `FK_service_1` (`organization_id`),
  CONSTRAINT `FK_service_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_area`
--

DROP TABLE IF EXISTS `service_area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_area` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) DEFAULT NULL,
  `service_area` text,
  `extent` geometry DEFAULT NULL,
  `uri` text,
  PRIMARY KEY (`id`),
  KEY `FK_service_area_1` (`service_id`),
  CONSTRAINT `FK_service_area_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_at_location`
--

DROP TABLE IF EXISTS `service_at_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_at_location` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) NOT NULL,
  `location_id` varchar(1536) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_service_at_location_1` (`service_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `FK_service_at_location_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  CONSTRAINT `service_at_location_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_taxonomy`
--

DROP TABLE IF EXISTS `service_taxonomy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_taxonomy` (
  `id` varchar(1536) NOT NULL,
  `service_id` varchar(1536) NOT NULL,
  `taxonomy_id` varchar(1536) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_service_taxonomy_1` (`service_id`),
  KEY `FK_service_taxonomy_2` (`taxonomy_id`),
  CONSTRAINT `FK_service_taxonomy_1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  CONSTRAINT `FK_service_taxonomy_2` FOREIGN KEY (`taxonomy_id`) REFERENCES `taxonomy` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `taxonomy`
--

DROP TABLE IF EXISTS `taxonomy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taxonomy` (
  `id` varchar(1536) NOT NULL,
  `name` text NOT NULL,
  `vocabulary` text,
  `parent_id` varchar(1536),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


CREATE FULLTEXT INDEX service_search ON service(`name`, description);
CREATE FULLTEXT INDEX service_name_search ON service(`name`);
CREATE FULLTEXT INDEX service_description_search ON service(`description`);
CREATE FULLTEXT INDEX taxonomy_search ON taxonomy(`name`);

--
-- Dumping routines for database 'ServiceDirectoryBucks'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

ALTER TABLE organization ADD email text;
ALTER TABLE organization ADD legal_status text;
ALTER TABLE organization ADD assured_date datetime;

ALTER TABLE service ADD application_process text;

ALTER TABLE eligibility ADD minimum_age int;
ALTER TABLE eligibility ADD maximum_age int;

ALTER TABLE service_taxonomy ADD eligibility_id varchar(1536);

ALTER TABLE contact ADD email text;
ALTER TABLE contact ADD personal_data boolean;
ALTER TABLE contact ADD sensitive_data boolean;

DROP TABLE IF EXISTS `identifier`;
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

CREATE TABLE `esd_external_id` (
  `uuid` varchar(1586) NOT NULL,
  `external_id` varchar(1586) DEFAULT NULL,
  `origin` text,
  `reference_table` text,
  PRIMARY KEY (`uuid`)
);