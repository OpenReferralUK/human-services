ALTER TABLE `cost_option` MODIFY amount decimal(10,2);
ALTER TABLE `cost_option` ADD `amount_description` text;
ALTER TABLE `eligibility` ADD minimum_age decimal(10,2);
ALTER TABLE `eligibility` ADD maximum_age decimal(10,2);