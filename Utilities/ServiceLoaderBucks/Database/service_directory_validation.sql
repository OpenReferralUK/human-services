select 'Missing parent organisation', s.id as service_id
from service s
inner join organization o on o.id = s.organization_id
where o.`name` = ''

union all

select 'Missing service name', s.id as service_id
from service s
where s.`name` = ''

union all

select 'Missing post code', s.id as service_id
from service s
inner join service_at_location sl on sl.service_id = s.id
inner join physical_address a on a.location_id = sl.location_id
where a.postal_code = ''

union all

select 'Missing city', s.id as service_id
from service s
inner join service_at_location sl on sl.service_id = s.id
inner join physical_address a on a.location_id = sl.location_id
where a.city = ''

union all

select 'Missing state/province', s.id as service_id
from service s
inner join service_at_location sl on sl.service_id = s.id
inner join physical_address a on a.location_id = sl.location_id
where a.state_province = ''

union all

select 'Missing country', s.id as service_id
from service s
inner join service_at_location sl on sl.service_id = s.id
inner join physical_address a on a.location_id = sl.location_id
where a.country = ''

union all

select 'Invalid status', s.id as service_id
from service s
where s.`status` is not null and s.`status` not in ('active', 'inactive', 'defunct', 'temporarily closed')

union all

select 'Invalid deliverable type', s.id as service_id
from service s
where s.deliverable_type is not null and s.deliverable_type not in ('Advice', 'Assessment', 'Counselling', 'Equipment', 'Financial Support', 'Information', 'Permission', 'Training')

union all

select 'Invalid schedule frequency', s.id as service_id
from service s
inner join regular_schedule rs on rs.service_id = s.id
where rs.freq is not null and rs.freq not in ('WEEKLY', 'MONTHLY')

union all

select 'Invalid schedule frequency', s.id as service_id
from service s
inner join eligibility e on e.service_id = s.id
where e.eligibility is not null and e.eligibility not in ('adult', 'child', 'teen', 'family', 'female', 'male', 'Transgender', 'Transgender - M to F', 'Transgender - F to M')

union all

select 'Invalid schedule frequency', s.id as service_id
from service s
inner join service_at_location sl on sl.service_id = s.id
inner join accessibility_for_disabilities a on a.location_id = sl.id
where a.accessibility is not null and a.accessibility not in ('cd', 'deaf_interpreter', 'disabled_parking', 'elevator', 'ramp', 'restroom', 'tape_braille', 'tty', 'wheelchair', 'wheelchair_van')

union all

select 'Missing taxonomy name', t.id as taxonomy_id
from taxonomy t
where t.`name` = ''

union all

select 'Invalid link taxonomy type', lt.id as link_taxonomy_id
from link_taxonomy lt
where lt.link_type is not null and lt.link_type not in ('organization', 'eligibility', 'cost_option', 'area')