import json
import socket
import urllib.error
import urllib.request
from contextlib import closing
from time import sleep
from SetUUID import AddUUID

import mysql.connector

from DataImport import DataImport


class CQCImport:
    def __init__(self, baseUrl):
        self.addUUID = AddUUID("ServiceDirectoryCQC", "CQC")
        self.baseUrl = baseUrl
        self.nextPage = None
        self.found = {"taxonomy": get_existing_taxonomy(), "service_taxonomy": [], "service": []}
        self.counts = {"services": 0, "taxonomy": len(self.found["taxonomy"]), "service_taxonomy": 0}
        self.id_found = {"taxonomy": [], "service": []}
        self.args = {"organization": [], "service": [], "location": [], "contact": [], "phone": [],
                     "service_at_location": [], "taxonomy": [], "service_taxonomy": [], "accessibility": [],
                     "eligibility": [], "cost_option": [], "regular_schedule": [], "physical_address": [], "review": []}
        with DBWith() as db:
            self.data = DataImport(self.id_found, db)
            self.args["organization"].append(
                [self.addUUID.get_uuid("CQC", "organization", "CQC"), "CQC", "The independent regulator of health and social care in England",
                 "https://www.cqc.org.uk/", None, None])
            while True:
                try:
                    print(f"Page {self.nextPage if self.nextPage else 1}")
                    self.importOrganizations(f'{self.baseUrl}{self.nextPage if self.nextPage else "/providers/"}')
                    if self.nextPage is None:
                        break
                except urllib.error.HTTPError as err:
                    print(err)
                    break

    def importOrganizations(self, url):
        page = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urllib.request.urlopen(page)
        res = webpage.read().decode()
        data = json.loads(res)

        self.nextPage = data['nextPageUri']

        for organization in data["providers"]:
            self.importOrganization(organization)
        self.data.insert_all(self.args)
        self.args = {"organization": [], "service": [], "location": [], "contact": [], "phone": [],
                     "service_at_location": [], "taxonomy": [], "service_taxonomy": [], "accessibility": [],
                     "eligibility": [], "cost_option": [], "regular_schedule": [], "physical_address": [], "review": []}

    def importOrganization(self, organization):
        page = urllib.request.Request(f"{self.baseUrl}/providers/{organization['providerId']}",
                                      headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urllib.request.urlopen(page)
        res = webpage.read().decode()
        data = json.loads(res)

        self.args["organization"].append(
            [self.addUUID.get_uuid(organization["providerId"], "organization", "CQC"), organization["providerName"], None, None, None, None])

        for location in data["locationIds"]:
            self.importService(location)

    def importService(self, service):
        self.counts["services"] += 1
        if not self.counts["services"] % 200:
            self.data.insert_all(self.args)
            self.addUUID.insert_new_uuid()
            self.args = {"organization": [], "service": [], "location": [], "contact": [], "phone": [],
                         "service_at_location": [], "taxonomy": [], "service_taxonomy": [], "accessibility": [],
                         "eligibility": [], "cost_option": [], "regular_schedule": [], "physical_address": [],
                         "review": []}
            print("Inserted records")
        data = {}
        try:
            page = urllib.request.Request(f"{self.baseUrl}/locations/{service}",
                                          headers={'User-Agent': 'Mozilla/5.0'})
            webpage = urllib.request.urlopen(page)
            res = webpage.read().decode()
            data = json.loads(res)
        except (urllib.error.HTTPError, urllib.error.URLError, socket.gaierror, socket.error):
            print(f"{self.baseUrl}/locations/{service}")
            self.importService(service)
        print(f'{self.counts["services"]}: {data["locationId"]}')


        serviceId = self.addUUID.get_uuid(data["locationId"], "service", "CQC")

        if data.get("deregistrationDate", "False"):
            DataImport.delete_service(serviceId)

        self.args["service"].append(
            [serviceId, self.addUUID.get_uuid(data["providerId"], "organization", "CQC"), data["name"], None, None, None,
             "active" if data.get("registrationStatus") else None, None, None, None])
        if data.get("onspdLatitude") and data.get("onspdLongitude"):
            self.args["location"].append(
                [self.addUUID.get_uuid(f'{data["onspdLatitude"]}{data["onspdLongitude"]}', "location", "CQC"), data["postalAddressLine1"], None,
                 data["onspdLatitude"], data["onspdLongitude"]])

            self.args["physical_address"].append(
                [self.args["location"][-1][0], self.args["location"][-1][0],
                 f"{data['postalAddressLine1']}\n{data.get('postalAddressLine2')}", data["postalAddressTownCity"],
                 f'{data.get("postalAddressCounty")}\n{data.get("region")}'.strip(), data["postalCode"], "GB", None])

            self.args["service_at_location"].append(
                [serviceId, serviceId, self.args["location"][-1][0]])

        if data.get("mainPhoneNumber"):
            self.args["contact"].append([serviceId, serviceId, None, None])
            self.args["phone"].append([serviceId, serviceId, data["mainPhoneNumber"], None])

        if data.get("regulatedActivities"):
            for item in data["regulatedActivities"]:
                if next((x for x in self.found["taxonomy"] if x[0] == f"regulatedActivities:{item['code']}"), False):
                    taxonomy = next(
                        (x for x in self.found["taxonomy"] if x[0] == f"regulatedActivities:{item['code']}"), False)
                else:
                    taxonomy = [f"regulatedActivities:{item['code']}", item["name"], "regulatedActivities", None]
                    self.found["taxonomy"].append(taxonomy)

                self.args["taxonomy"].append(taxonomy)

                self.args["service_taxonomy"].append([self.counts["service_taxonomy"], serviceId, taxonomy[0]])

        if data.get("gacServiceTypes"):
            for item in data["gacServiceTypes"]:
                if next((x for x in self.found["taxonomy"] if x[0] == f"gacServiceTypes:{item['name']}"), False):
                    taxonomy = next(
                        (x for x in self.found["taxonomy"] if x[0] == f"gacServiceTypes:{item['name']}"), False)
                else:
                    taxonomy = [f"gacServiceTypes:{item['name']}", item["description"], "gacServiceTypes", None]
                    self.found["taxonomy"].append(taxonomy)

                self.args["taxonomy"].append(taxonomy)

                self.args["service_taxonomy"].append([self.counts["service_taxonomy"], serviceId, taxonomy[0]])
                self.counts["service_taxonomy"] += 1

        if data.get("specialisms"):
            for item in data["specialisms"]:
                if next((x for x in self.found["taxonomy"] if x[0] == f"specialisms:{item['name']}"), False):
                    taxonomy = next(
                        (x for x in self.found["taxonomy"] if x[0] == f"specialisms:{item['name']}"), False)
                else:
                    taxonomy = [f"specialisms:{item['name']}", item["name"], "specialisms", None]
                    self.found["taxonomy"].append(taxonomy)

                self.args["taxonomy"].append(taxonomy)

                self.args["service_taxonomy"].append([self.counts["service_taxonomy"], serviceId, taxonomy[0]])
                self.counts["service_taxonomy"] += 1

        if data.get("inspectionCategories"):
            for item in data["inspectionCategories"]:
                if next((x for x in self.found["taxonomy"] if x[0] == f"inspectionCategories:{item['code']}"), False):
                    taxonomy = next(
                        (x for x in self.found["taxonomy"] if x[0] == f"inspectionCategories:{item['code']}"), False)
                else:
                    taxonomy = [f"specialisms:{item['code']}", item["name"], "inspectionCategories", None]
                    self.found["taxonomy"].append(taxonomy)

                self.args["taxonomy"].append(taxonomy)

                self.args["service_taxonomy"].append([self.counts["service_taxonomy"], serviceId, taxonomy[0]])
                self.counts["service_taxonomy"] += 1

        review = {}
        if data.get("reports"):
            review["service_id"] = serviceId
            review["url"] = f'{self.baseUrl}{data["reports"][0]["reportUri"]}'
            review["date"] = data["reports"][0]["reportDate"]
        if data.get("currentRatings"):
            if data["currentRatings"].get("overall"):
                date = data["currentRatings"]["overall"].get("reportDate")
                if date:
                    review["date"] = date
                review["title"] = data["currentRatings"]["overall"].get("rating")

                if data["currentRatings"]["overall"].get("keyQuestionRatings"):
                    ratings = []
                    for item in data["currentRatings"]["overall"]["keyQuestionRatings"]:
                        ratings.append(f'{item["name"]} - {item["rating"]}')
                    if len(ratings) != 0:
                        ratings = " \n".join(ratings)
                        review["description"] = ratings

        if len(review.keys()) != 0:
            self.args["review"].append(
                [serviceId, serviceId, self.addUUID.get_uuid("CQC", "organization", "CQC"), review["title"], review["description"], review["date"],
                 review["title"], review.get("url"), None])


def get_existing_taxonomy():
    output = []
    with DBWith() as dbService:
        stmt = "SELECT id, name, vocabulary, parent_id FROM taxonomy"
        with closing(dbService.cursor(dictionary=True)) as c:
            c.execute(stmt)
            for item in c:
                sleep(0.000001)
                output.append([item["id"], item["name"], item["vocabulary"], item["parent_id"]])

    return output


class DBWith:
    def __enter__(self):
        self.db = openDb()
        return self.db

    def __exit__(self, exc_type, exc_val, exc_tb):
        closeDb([self.db])


def openDb():
    connectService = mysql.connector.connect(
        host="informplus-beta.rds.esd.org.uk",
        user="awsuserbeta",
        passwd="pQr1$m",
        database="ServiceDirectoryCQC")
    return connectService


def closeDb(db_list):
    for item in db_list:
        if item is None:
            continue
        else:
            item.close()


if __name__ == "__main__":
    CQCImports("https://api.cqc.org.uk/public/v1")
