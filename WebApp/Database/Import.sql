INSERT INTO `ServiceDirectory`.esd_postcode(code, latitude, longitude)
SELECT `Code`, (`BoundaryMinLatitude` + `BoundaryMaxLatitude`) / 2 AS Latitude, (`BoundaryMinLongitude` + `BoundaryMaxLongitude`) / 2 AS Longitude
FROM `InformPlusAlpha`.GeoArea WHERE LevelID = (SELECT ID FROM `InformPlusAlpha`.GeoAreaLevel WHERE Identifier = 'Postcode')