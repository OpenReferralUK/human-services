import hashlib
import json
import urllib.error
import urllib.parse
import urllib.request
from contextlib import closing
from time import sleep
from typing import List, Any, Union, Dict

import mysql.connector
from mysql.connector import CMySQLConnection, MySQLConnection

from DataImport import DataImport
from SetUUID import AddUUID


class FireHoseOpenActive:
    data: DataImport
    args: Dict[Union[str, Any], Union[List[Any], Any]]
    baseUrl: str

    def __init__(self, baseUrl):
        self.addUuid = AddUUID("ServiceDirectoryOpenActiveAggregated", "OpenActiveFireHose")
        self.baseUrl = baseUrl
        self.nextPage = None
        self.found = {"taxonomy": get_existing_taxonomy(), "service_taxonomy": [], "service": []}
        self.counts = {"services": 0, "taxonomy": len(self.found["taxonomy"]), "service_taxonomy": 0}
        self.id_found = {"taxonomy": [], "service": []}
        self.args = {"organization": [], "service": [], "location": [], "contact": [], "phone": [],
                     "service_at_location": [], "taxonomy": [], "service_taxonomy": [], "accessibility": [],
                     "eligibility": [], "cost_option": [], "regular_schedule": [], "link_taxonomy": [],
                     "physical_address": [], "review": []}
        with DBWith() as db:
            self.data = DataImport(db)
            while True:
                try:
                    print(f"Page {self.nextPage if self.nextPage else 1}")
                    self.importServices(self.nextPage if self.nextPage else self.baseUrl)
                    if self.nextPage is None:
                        break
                except urllib.error.HTTPError as err:
                    print(err)
                    break

    def importServices(self, url):
        """
        :param url: Endpoint url
        :type url: str
        """
        page = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0',
                                                    'X-API-KEY': ''}) # Add API key
        webpage = urllib.request.urlopen(page)
        res = webpage.read().decode()
        data: dict = json.loads(res)

        self.nextPage = data['next']

        service: dict
        for service in data["items"]:
            self.importService(service)
        self.data.insert_all(self.args)
        self.args = {"organization": [], "service": [], "location": [], "contact": [], "phone": [],
                     "service_at_location": [], "taxonomy": [], "service_taxonomy": [], "accessibility": [],
                     "eligibility": [], "cost_option": [], "regular_schedule": [], "link_taxonomy": [],
                     "physical_address": [], "review": []}

    def importService(self, service: dict):
        self.counts["services"] += 1

        # Importing data into database every 100 services
        if not self.counts["services"] % 100:
            self.data.insert_all(self.args)
            self.args = {"organization": [], "service": [], "location": [], "contact": [], "phone": [],
                         "service_at_location": [], "taxonomy": [], "service_taxonomy": [], "accessibility": [],
                         "eligibility": [], "cost_option": [], "link_taxonomy": [], "regular_schedule": [],
                         "physical_address": [], "review": []}
            print("Inserted records")
        data: dict = service["data"]

        organizer: dict = findItem(data, "organizer")
        organizationId: str = organizer.get("id")
        eligibilityTaxonomy = None
        if not organizationId:
            organizationId = self.addUuid.get_uuid(str(organizer.get("name")), "organization", "OpenActiveFireHose")
        self.args["organization"].append([organizationId, organizer.get("name"),
                                          "", organizer.get("url"), None, None])

        superEvent: dict = findItem(data, "superEvent")
        serviceId: str = self.addUuid.get_uuid(data.get("identifier"), "service", "OpenActiveFireHose")
        if not serviceId:
            pass
        self.args["service"].append([serviceId, organizationId, findItem(superEvent, "name"),
                                     findItem(superEvent, "description") if findItem(superEvent, "description") else "",
                                     findItem(data, "url"), findItem(data, "email"),
                                     "active" if service.get("state") == "updated" else None,
                                     None, None, None])

        eligibility = [serviceId, serviceId, None, None, None]

        if findItem(superEvent, "genderRestriction"):
            gender = str(findItem(superEvent, "genderRestriction")).split("/")[-1]
            if gender != "NoRestriction":
                if "Female" in gender:
                    gender = "Female"
                elif "Male" in gender:
                    gender = "Male"
                self.args["taxonomy"].append([f'gender:{gender}', gender, "gender", None])
                self.args["link_taxonomy"].append([f'{serviceId}:{gender}', "eligibility",
                                                   serviceId, f'gender:{gender}'])
                eligibilityTaxonomy = True

        leaders: dict = findItem(data, "leader")
        if leaders:
            for leader in leaders:
                leaderId = leader.get("identifier")
                name = " ".join([leader.get("givenName") if leader.get("givenName") else "",
                                 leader.get("familyName") if leader.get("familyName") else ""]).strip()
                if not name:
                    name = leader.get("name")
                if not leaderId:
                    leaderId = f'{hashlib.md5(str(leader.get(name)).encode()).hexdigest()}'
                self.args["contact"].append([leaderId, serviceId, name, leader.get("jobTitle")])
                if leader.get("telephone"):
                    self.args["phone"].append([leaderId, leaderId,
                                               leader.get("telephone"), None])
        elif findItem(data, "telephone"):
            self.args["contact"].append([serviceId, serviceId, None, None])
            self.args["phone"].append([serviceId, serviceId, findItem(data, "telephone"), None])

        offers: dict = findItem(data, "offers")
        if offers:
            for i in range(len(offers)):
                offer = offers[i]
                option = None
                if offer.get("acceptedPaymentMethod"):
                    option = []
                    item: str
                    for item in offer["acceptedPaymentMethod"]:
                        option.append(item.split("#")[-1])
                    option = "\n".join(option).strip()
                if offer.get("beta:availableChannel"):
                    option = []
                    item: str
                    for item in offer["beta:availableChannel"]:
                        option.append(item.split("#")[-1])
                    option = "\n".join(option).strip()
                self.args["cost_option"].append([offer.get("id") if offer.get("id") else serviceId, serviceId,
                                                 None, None, option, offer.get("price"),
                                                 f'{offer.get("price")} {offer.get("priceCurrency")}'])

        location: dict = findItem(data, "location")
        lat: float = 0
        long: float = 0
        locationFound = False
        if location:
            if location.get("geo"):
                lat = location["geo"].get("latitude")
                long = location["geo"].get("longitude")

            service_at_locationId = None
            if location.get("identifier"):
                locationId = self.addUuid.get_uuid(location.get("identifier"), "location", "OpenActiveFireHose")
                locationFound = True
                self.args["location"].append(
                    [locationId, location.get("name"), None, lat if lat != 0 else None,
                     long if long != 0 else None])

                self.args["service_at_location"].append([f'{serviceId}:{self.args["location"][-1][0]}',
                                                         serviceId, self.args["location"][-1][0]])
                service_at_locationId = self.args["service_at_location"][-1][0]

                address: dict = location.get("address")
                # Takes address except from the last 2 sections
                address1: str = ",".join(str(address.get("imin:fullAddress")).split(",")[:-2])
                if address:
                    self.args["physical_address"].append(
                        [locationId, locationId, address1 if address1 else None,
                         findItem(location, "addressLocality"),
                         findItem(location, "addressRegion") if findItem(location, "addressRegion") else "",
                         findItem(location, "postalCode"),
                         findItem(location, "addressCountry"), None])

                if location.get("amenityFeature"):
                    if len(location["amenityFeature"]):
                        for i in range(len(location["amenityFeature"])):
                            self.args["location"][-1][2] = str(self.args["location"][-1][2]) + \
                                                           location["amenityFeature"][i]["name"]
        if findItem(data, "activity"):
            if len(findItem(data, "activity")):
                activities: list[dict] = findItem(data, "activity")
                for i in range(len(activities)):
                    activity: dict = activities[i]
                    activityId = activity.get("id")
                    if activityId:
                        activityId = str(activityId).split("#")[-1]
                        self.args["taxonomy"].append([activityId, activity.get("prefLabel"), "activity", None])
                        self.args["service_taxonomy"].append([f'{serviceId}:{i}', serviceId, activityId])
                    else:
                        pass

        if data.get("eventSchedule"):
            if len(data["eventSchedule"]):
                eventSchedules: list = data["eventSchedule"]
                for i in range(len(eventSchedules)):
                    if type(eventSchedules[i]) == str:
                        eventSchedule: dict = json.loads(eventSchedules[i])
                    elif type(eventSchedules[i]) == dict:
                        eventSchedule: dict = eventSchedules[i]
                    else:
                        continue
                    byDay = None
                    if eventSchedule.get("byDay"):
                        for day in eventSchedule.get("byDay"):
                            byDay = str(day).split("/")[-1]
                            self.args["regular_schedule"].append(
                                [f'{serviceId}:{i}', serviceId, None, eventSchedule.get("startTime"),
                                 eventSchedule.get("endTime"), None, None, eventSchedule.get("startDate"), None,
                                 None,
                                 byDay, None, None])
                    else:
                        self.args["regular_schedule"].append(
                            [f'{serviceId}:{i}', serviceId, None, eventSchedule.get("startTime"),
                             eventSchedule.get("endTime"), None, None, eventSchedule.get("startDate"), None, None,
                             byDay, None, None])

        if data.get("eventSchedule"):
            if len(data["eventSchedule"]):
                eventSchedules: list = data["eventSchedule"]
                for i in range(len(eventSchedules)):
                    if type(eventSchedules[i]) == str:
                        eventSchedule: dict = json.loads(eventSchedules[i])
                    elif type(eventSchedules[i]) == list:
                        eventSchedule: dict = eventSchedules[i]
                    else:
                        continue
                    byDay = None
                    if eventSchedule.get("byDay"):
                        for day in eventSchedule.get("byDay"):
                            byDay = str(day).split("/")[-1]
                            if locationFound:
                                self.args["regular_schedule"].append(
                                    [f'{serviceId}:{i}', None, service_at_locationId, eventSchedule.get("startTime"),
                                     eventSchedule.get("endTime"), None, None, eventSchedule.get("startDate"), None, None,
                                     byDay, None, None])
                            else:
                                self.args["regular_schedule"].append(
                                    [f'{serviceId}:{i}', serviceId, None, eventSchedule.get("startTime"),
                                     eventSchedule.get("endTime"), None, None, eventSchedule.get("startDate"), None,
                                     None,
                                     byDay, None, None])
                    else:
                        if locationFound:
                            self.args["regular_schedule"].append(
                                [f'{serviceId}:{i}', None, service_at_locationId, eventSchedule.get("startTime"),
                                 eventSchedule.get("endTime"), None, None, eventSchedule.get("startDate"), None, None,
                                 byDay, None, None])
                        else:
                            self.args["regular_schedule"].append(
                                [f'{serviceId}:{i}', serviceId, None, eventSchedule.get("startTime"),
                                 eventSchedule.get("endTime"), None, None, eventSchedule.get("startDate"), None, None,
                                 byDay, None, None])
        if findItem(data, "ageRange"):
            ageRange: dict = findItem(data, "ageRange")
            eligibility[3] = ageRange.get("minValue") if ageRange.get("minValue") != 0 else None
            eligibility[4] = ageRange.get("MaxValue") if ageRange.get("MaxValue") != 0 else None

        if eligibility != [serviceId, serviceId, None, None, None] or eligibilityTaxonomy:
            self.args["eligibility"].append(eligibility)


def get_existing_taxonomy() -> List[List[Any]]:
    """
    Returns all existing taxonomies from the database to stop duplication of existing taxonomies
    :return:
    """
    output = []
    with DBWith() as dbService:
        stmt = "SELECT id, name, vocabulary, parent_id FROM taxonomy"
        with closing(dbService.cursor(dictionary=True)) as c:
            c.execute(stmt)
            for item in c:
                sleep(0.000001)  # To avoid Mysql.Connector error
                output.append([item["id"], item["name"], item["vocabulary"], item["parent_id"]])
    return output


class DBWith:
    db: Union[Union[CMySQLConnection, MySQLConnection], Any]

    def __enter__(self) -> Union[Union[CMySQLConnection, MySQLConnection], Any]:
        self.db = openDb()
        return self.db

    def __exit__(self, exc_type, exc_val, exc_tb):
        closeDb([self.db])


def openDb() -> Union[Union[CMySQLConnection, MySQLConnection], Any]:
    """
     Opens a connection to the database generated from
     https://github.com/OpenReferralUK/human-services/tree/master/WebApp/Database
    """
    connectService: Union[Union[CMySQLConnection, MySQLConnection], Any] = mysql.connector.connect(
        host="",
        user="",
        passwd="",
        database="ServiceDirectoryOpenActiveAggregated")
    return connectService


def closeDb(db_list):
    """
    :type db_list: List[Union[CMySQLConnection, MySQLConnection]]
    """
    for item in db_list:
        if item is None:
            continue
        else:
            item.close()


def findItem(obj, key):
    """
    Finds the given key inside the dict
    :type key: str
    :type obj: dict
    """
    if key in obj:
        return obj[key]
    if type(obj) == str:
        return None
    for k, v in obj.items():
        if isinstance(v, dict):
            item = findItem(v, key)
            if item is not None:
                return item
        elif isinstance(v, list):
            for list_item in v:
                item = findItem(list_item, key)
                if item is not None:
                    return item


if __name__ == "__main__":
    FireHoseOpenActive("https://firehose.imin.co/firehose/session-series")
