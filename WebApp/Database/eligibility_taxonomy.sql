drop table if exists eligibility_taxonomy; 

drop view if exists eligibility_taxonomy;

CREATE VIEW eligibility_taxonomy AS
SELECT
	link_taxonomy.link_id,
	taxonomy.*
FROM
	`link_taxonomy`
INNER JOIN
	taxonomy
ON
	taxonomy.id = `link_taxonomy`.`taxonomy_id`
WHERE
	link_taxonomy.link_type = 'eligibility';