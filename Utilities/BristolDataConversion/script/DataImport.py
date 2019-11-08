import argparse
import csv
import sys
import textwrap
import threading

import mysql
import mysql.connector

import utils.db as db


class DataImport:
    def __init__(self, database, path):
        self.database = database
        self.path = path
        self.found = {"taxonomy": [], "service": [], "organization": [], "location": [], "service_at_location": []}
        self.deleted = {"organization": []}

    def importTables(self):
        org = threading.Thread(target=self.organization)
        org.start()
        org.join()
        print("<---->")
        ser = threading.Thread(target=self.service)
        tax = threading.Thread(target=self.taxonomy)
        ser.start()
        tax.start()
        ser.join()
        tax.join()
        print("<---->")

        loc = threading.Thread(target=self.location)
        loc.start()
        loc.join()
        print("<---->")
        ser_loc = threading.Thread(target=self.service_at_location)
        acc = threading.Thread(target=self.accessibility_for_disabilities)
        eli = threading.Thread(target=self.eligibility)
        fund = threading.Thread(target=self.funding)
        ser_area = threading.Thread(target=self.service_area)
        link = threading.Thread(target=self.link_taxonomy)
        ser_tax = threading.Thread(target=self.service_taxonomy)
        con = threading.Thread(target=self.contact)

        ser_loc.start()
        con.start()
        acc.start()
        eli.start()
        fund.start()
        ser_area.start()
        link.start()
        ser_tax.start()

        ser_loc.join()
        con.join()
        acc.join()
        eli.join()
        fund.join()
        ser_area.join()
        link.join()
        ser_tax.join()
        print("<---->")
        rev = threading.Thread(target=self.review)
        pho = threading.Thread(target=self.phone)
        reg = threading.Thread(target=self.regular_schedule)
        hol = threading.Thread(target=self.holiday_schedule)
        cos = threading.Thread(target=self.cost_option)

        rev.start()
        pho.start()
        reg.start()
        hol.start()
        cos.start()

        rev.join()
        pho.join()
        reg.join()
        hol.join()
        cos.join()

        print("<---->")

        phy = threading.Thread(target=self.physical_address)
        phy.start()
        phy.join()
        print("<---->")
        self.update_attending_type()

    def organization(self):
        print("Organization")
        with open(self.path + "organization.csv", "r") as organization:
            dbService = self.openDb()
            csv_in_service = csv.DictReader(organization)
            args = []
            for row in csv_in_service:
                args.append([row["id"],
                             row["name"],
                             row["description"],
                             row["url"],
                             row["logo"],
                             row["uri"]])
                self.found["organization"].append(row["id"])
            stmt = "INSERT INTO organization (id, `name`, description, url, logo, uri) VALUES " + ",".join(
                "(%s, %s, %s, %s, %s, %s)" for _ in args)
            stmt += "ON DUPLICATE KEY UPDATE " \
                    "`name` = VALUES(`name`), description = VALUES(description), url = VALUES(url), " \
                    "logo = VALUES(logo), uri = VALUES(uri)"
            flat = [item for sublist in args for item in sublist]

            c = dbService.cursor()
            try:
                c.execute(stmt, flat)
            except mysql.connector.Error as err:
                print(textwrap.shorten(str(args), width=100))
                print(err)
            finally:
                c.close()
                dbService.commit()
                self.closeDb([dbService])

    def service(self):
        print("Service")
        with open(self.path + "service.csv", "r") as service:
            dbService = self.openDb()
            try:
                csv_in_service = csv.DictReader(service)

                args = []
                for row in csv_in_service:
                    if row["organization_id"] not in self.found["organization"]:
                        # print("Not found")
                        # print(row)
                        if row["organization_id"] not in self.deleted["organization"]:
                            self.deleted["organization"].append(row["organization_id"])
                    else:
                        args.append([row["id"],
                                     row["organization_id"],
                                     row["name"],
                                     row["description"],
                                     row["url"],
                                     row["email"],
                                     row["status"],
                                     row["fees"],
                                     row["accreditations"],
                                     row["deliverable_type"]])

                        self.found["service"].append(row["id"])

                stmt = "INSERT INTO service (id, organization_id, name, description, url, email, status, fees, " \
                       "accreditations, deliverable_type) " \
                       "VALUES " + ",".join("(%s, %s,%s, %s,%s, %s,%s, %s,%s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "name = VALUES(name), description = VALUES(description), " \
                        "url = VALUES(url), email = VALUES(email), status = VALUES(status), fees = VALUES(fees), " \
                        "accreditations = VALUES(accreditations), deliverable_type = VALUES(deliverable_type)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()

                # flat = [item for sublist in args for item in sublist]
                # for i in range(len(args) // 1):
                #
                #     stmt = "INSERT INTO service (id, organization_id, name, description, url, email, status, fees, " \
                #             "accreditations, deliverable_type) " \
                #            "VALUES " + ",".join("(%s, %s,%s, %s,%s, %s,%s, %s,%s, %s)" for _ in args[1 * i:1 * (i + 1)])
                #     stmt += "ON DUPLICATE KEY UPDATE " \
                #             "organization_id = VALUES(organization_id), name = VALUES(name), description = VALUES(description), " \
                #             "url = VALUES(url), email = VALUES(email), status = VALUES(status), fees = VALUES(fees), " \
                #             "accreditations = VALUES(accreditations), deliverable_type = VALUES(deliverable_type)"
                #
                #     c = dbService.cursor()
                #     try:
                #         c.execute(stmt, flat[10 * i:10 * (i + 1)])
                #     except mysql.connector.Error as err:
                #         print(flat[10 * i:10 * (i + 1)])
                #         # print(stmt)
                #         print(err)
                #     finally:
                #         c.close()
                #         dbService.commit()
            finally:
                self.closeDb([dbService])

    def accessibility_for_disabilities(self):
        print("Accessibility for disabilities")
        with open(self.path + "accessibility_for_disabilities.csv", "r") as accessibility_for_disabilities:
            dbService = self.openDb()
            try:
                csv_in_accessibility_for_disabilities = csv.DictReader(accessibility_for_disabilities)

                args = []
                for row in csv_in_accessibility_for_disabilities:
                    args.append([row["id"],
                                 row["location_id"],
                                 row["accessibility"]])
                stmt = "INSERT INTO accessibility_for_disabilities (id, location_id, accessibility) VALUES " + ",".join(
                    "(%s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE location_id = VALUES(location_id), " \
                        "accessibility = VALUES(accessibility);"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def taxonomy(self):
        print("Taxonomy")
        with open(self.path + "taxonomy.csv", "r") as taxonomy:
            dbService = self.openDb()

            try:
                csv_in_taxonomy = csv.DictReader(taxonomy)

                args = []

                for row in csv_in_taxonomy:
                    args.append([row["id"],
                                 row["name"],
                                 row["vocabulary"],
                                 None])
                    self.found["taxonomy"].append([row["id"],
                                                   row["name"],
                                                   row["vocabulary"],
                                                   None])
                stmt = "INSERT INTO taxonomy (id, name, vocabulary, parent_id) VALUES " + ",".join(
                    "(%s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "name = VALUES(name), vocabulary = VALUES(vocabulary), parent_id = NULL"

                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def eligibility(self):
        print("Eligibility")
        with open(self.path + "eligibility.csv", "r") as eligibility:
            dbService = self.openDb()
            try:
                csv_in_eligibility = csv.DictReader(eligibility)

                args = []
                for row in csv_in_eligibility:
                    args.append([row["id"],
                                 row["service_id"],
                                 row["eligibility"]])
                if not args:
                    return
                stmt = "INSERT INTO eligibility (id, service_id, eligibility) VALUES " + ",".join(
                    "(%s, %s, %s)" for _ in args)
                stmt += " ON DUPLICATE KEY UPDATE " \
                        "eligibility = VALUES(eligibility)"

                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def review(self):
        print("Review")
        with open(self.path + "review.csv", "r") as review:
            dbService = self.openDb()
            try:
                csv_in_review = csv.DictReader(review)

                args = []
                for row in csv_in_review:
                    args.append([row["id"],
                                 row["service_id"],
                                 row["reviewer_organization_id"],
                                 row["title"],
                                 row["description"],
                                 row["date"],
                                 row["score"],
                                 row["url"],
                                 row["widget"]])
                if not args:
                    return
                stmt = "INSERT INTO review (id, service_id, reviewer_organization_id, title, description, date, " \
                       "score, url, widget) VALUES " + ",".join("(%s, %s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "title = VALUES(title), description = VALUES(description), date = VALUES(date), " \
                        "score = VALUES(score), url = VALUES(url), widget = VALUES(widget)"

                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print("review")
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
                    self.closeDb([dbService])
            finally:
                self.closeDb([dbService])

    def funding(self):
        print("Funding")
        with open(self.path + "funding.csv", "r") as funding:
            dbService = self.openDb()
            try:
                csv_in_funding = csv.DictReader(funding)

                stmt = "INSERT INTO funding (id, service_id, source) VALUES (%s, %s, %s) " \
                       "ON DUPLICATE KEY UPDATE " \
                       "source = VALUES(source)"

                i = 0
                for row in csv_in_funding:
                    args = (row["id"],
                            row["service_id"],
                            row["source"])
                    try:
                        db.execute(dbService, stmt, args, "prepared", False)
                    except mysql.connector.Error as err:
                        print(row)
                        print(err)
                    if ((i % 100) == 0) and i != 0:
                        dbService.commit()
                        print(i)
                    i += 1
                dbService.commit()
            finally:
                self.closeDb([dbService])

    def link_taxonomy(self):
        print("Link Taxonomy")
        with open(self.path + "link_taxonomy.csv", "r") as link_taxonomy:
            dbService = self.openDb()
            try:
                csv_in_link_taxonomy = csv.DictReader(link_taxonomy)

                args = []
                for row in csv_in_link_taxonomy:
                    args.append([row["id"],
                                 row["link_type"],
                                 row["link_id"],
                                 row["taxonomy_id"]])
                if not args:
                    return
                stmt = "INSERT INTO organization (id, `name`, description, url, logo, uri) VALUES " + ",".join(
                    "(%s, %s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "`name` = VALUES(`name`), description = VALUES(description), url = VALUES(url), " \
                        "logo = VALUES(logo), uri = VALUES(uri)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def service_taxonomy(self):
        print("Service taxonomy")
        with open(self.path + "service_taxonomy.csv", "r") as service_taxonomy:
            dbService = self.openDb()
            try:
                csv_in_service_taxonomy = csv.DictReader(service_taxonomy)
                args = []
                for row in csv_in_service_taxonomy:
                    if row["service_id"] in self.found["service"]:
                        args.append([row["id"],
                                     row["service_id"],
                                     row["taxonomy_id"]])

                if not args:
                    return
                stmt = "INSERT INTO service_taxonomy (id, service_id, taxonomy_id) VALUES " + ",".join(
                    "(%s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), taxonomy_id = VALUES(taxonomy_id)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def service_area(self):
        print("Service area")
        with open(self.path + "service_area.csv", "r") as service_area:
            dbService = self.openDb()
            try:
                csv_in_location = csv.DictReader(service_area)
                args = []
                for row in csv_in_location:
                    if row["service_id"] in self.found["service"]:
                        args.append([row["id"],
                                     row["service_id"],
                                     row["service_area"],
                                     None,
                                     row["uri"]])
                stmt = "INSERT INTO service_area (id, service_id, service_area, extent, uri) VALUES " + ",".join(
                    "(%s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), service_area = VALUES(service_area), uri = VALUES(uri)"

                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def service_at_location(self):
        print("Service at location")
        with open(self.path + "service_at_location.csv", "r") as service_at_location:
            dbService = self.openDb()
            try:
                csv_in_location = csv.DictReader(service_at_location)
                args = []
                for row in csv_in_location:
                    if row["service_id"] in self.found["service"]:
                        args.append([row["id"],
                                     row["service_id"],
                                     row["location_id"]])
                        self.found["service_at_location"].append(row["id"])
                stmt = "INSERT INTO service_at_location (id, service_id, location_id) VALUES " + \
                       ",".join("(%s, %s, %s)" for _ in args)
                stmt += " ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), location_id = VALUES(location_id);\n"

                flat = [item for sublist in args for item in sublist]
                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def location(self):
        print("Location")
        with open(self.path + "location.csv", "r") as location:
            dbService = self.openDb()
            try:
                csv_in_location = csv.DictReader(location)
                args = []
                for row in csv_in_location:
                    args.append([row["id"],
                                 row["name"],
                                 row["description"],
                                 row["latitude"],
                                 row["longitude"]])
                stmt = "INSERT INTO location (id, name, description, latitude, longitude) VALUES " + ",".join(
                    "(%s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "name = VALUES(name), description = VALUES(description), " \
                        "latitude = VALUES(latitude), longitude = VALUES(longitude)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def physical_address(self):
        print("Physical address")
        with open(self.path + "physical_address.csv", "r") as physicalAddress:
            dbService = self.openDb()
            try:
                csv_in_physical_address = csv.DictReader(physicalAddress)
                args = []
                for row in csv_in_physical_address:
                    args.append([row["id"],
                                 row["location_id"],
                                 row["address_1"],
                                 row["city"],
                                 row["state_province"],
                                 row["postal_code"],
                                 row["country"]])
                stmt = "INSERT INTO physical_address (id, location_id, address_1, city, state_province, " \
                       "postal_code, country) VALUES " + ",".join("(%s, %s, %s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "location_id = VALUES(location_id), address_1 = VALUES(address_1), city = VALUES(city), " \
                        "state_province = VALUES(state_province), postal_code = VALUES(postal_code), " \
                        "country = VALUES(country);"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
                    self.closeDb([dbService])
            finally:
                self.closeDb([dbService])

    def contact(self):
        print("Contact")
        with open(self.path + "contact.csv", "r") as contact:
            dbService = self.openDb()
            try:
                csv_in_contact = csv.DictReader(contact)
                args = []
                for row in csv_in_contact:
                    args.append([row["id"],
                                 row["service_id"],
                                 row["name"],
                                 row["title"]])
                stmt = "INSERT INTO contact (id, service_id, name, title) values " + ",".join(
                    "(%s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), name = VALUES(name), title = VALUES(title)"

                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def cost_option(self):
        print("Cost Option")
        with open(self.path + "cost_option.csv", "r") as costOption:
            dbService = self.openDb()
            try:
                csv_in_cost_option_schedule = csv.DictReader(costOption)
                args = []
                for row in csv_in_cost_option_schedule:
                    args.append([row["id"],
                                 row["service_id"],
                                 row["valid_from"],
                                 row["valid_to"],
                                 row["option"],
                                 row["amount"]])
                if not args:
                    return

                stmt = "INSERT INTO cost_option (id, service_id, valid_from, valid_to, `option`, amount) " \
                       "VALUES " + ",".join("(%s, %s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), valid_from = VALUES(valid_from), " \
                        "valid_to = VALUES(valid_to), `option` = VALUES(`option`), amount = VALUES(amount)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print("Cost option")
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def phone(self):
        print("Phone")
        with open(self.path + "phone.csv", "r") as phone:
            dbService = self.openDb()
            try:
                csv_in_phone_schedule = csv.DictReader(phone)
                args = []
                for row in csv_in_phone_schedule:
                    args.append([row["id"],
                                 row["contact_id"],
                                 row["number"],
                                 row["language"]])
                stmt = "INSERT INTO phone (id, contact_id, number, language) VALUES " + ",".join(
                    "(%s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "contact_id = VALUES(contact_id), number = VALUES(number), language = VALUES(language)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print("phone")
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def holiday_schedule(self):
        print("Holiday Schedule")
        with open(self.path + "holiday_schedule.csv", "r") as holidaySchedule:
            dbService = self.openDb()
            try:
                csv_in_holiday_schedule = csv.DictReader(holidaySchedule)

                args = []
                for row in csv_in_holiday_schedule:
                    args.append([row["id"],
                                 row["service_id"],
                                 row["service_at_location_id"],
                                 row["closed"],
                                 row["opens_at"],
                                 row["closes_at"],
                                 row["start_date"],
                                 row["end_date"]])
                if not args:
                    return
                stmt = "INSERT INTO holiday_schedule (id, service_id, service_at_location_id, closed, opens_at, " \
                       "closes_at, start_date, end_date) VALUES " + \
                       ",".join("(%s, %s, %s, %s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), service_at_location_id = VALUES(service_at_location_id), " \
                        "closed = VALUES(closed), opens_at = VALUES(opens_at), closes_at = VALUES(closes_at), " \
                        "start_date = VALUES(start_date), end_date = VALUES(end_date)"

                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print("Holiday schedule")
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def regular_schedule(self):
        print("Regular Schedule")
        with open(self.path + "regular_schedule.csv", "r") as regularSchedule:
            dbService = self.openDb()
            try:
                csv_in_regular_schedule = csv.DictReader(regularSchedule)
                args = []
                for row in csv_in_regular_schedule:
                    if row["service_id"] in ["", None, "NULL"] and row["service_at_location_id"] in ["", None, "NULL"]:
                        continue
                    elif row["service_id"] not in ["", None, "NULL"] and \
                            row["service_at_location_id"] not in ["", None, "NULL"]:
                        if row["service_at_location_id"] not in self.found["service_at_location"]:
                            continue
                        if row["service_id"] not in self.found["service"]:
                            continue

                        args.append([row["id"], row["service_id"], row["service_at_location_id"], row["opens_at"],
                                     row["closes_at"], row["valid_from"], row["valid_to"], row["dtstart"], row["freq"],
                                     row["interval"], row["byday"], row["bymonthday"], row["description"]])
                    elif row["service_id"] not in ["", None, "NULL"]:
                        if row["service_id"] not in self.found["service"]:
                            continue
                        args.append([row["id"], row["service_id"], None, row["opens_at"],
                                     row["closes_at"], row["valid_from"], row["valid_to"], row["dtstart"], row["freq"],
                                     row["interval"], row["byday"], row["bymonthday"], row["description"]])
                    elif row["service_at_location_id"] not in ["", None, "NULL"]:
                        if row["service_at_location_id"] not in self.found["service_at_location"]:
                            continue
                        args.append([row["id"], None, row["service_at_location_id"], row["opens_at"],
                                     row["closes_at"], row["valid_from"], row["valid_to"], row["dtstart"], row["freq"],
                                     row["interval"], row["byday"], row["bymonthday"], row["description"]])
                    else:
                        print("Not Found")
                if not args:
                    return
                stmt = "INSERT INTO regular_schedule (id, service_id, service_at_location_id, opens_at, closes_at, " \
                       "valid_from, valid_to, dtstart, freq, `interval`, byday, bymonthday, description) VALUES " + \
                       ",".join("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" for _ in args)
                stmt += "ON DUPLICATE KEY UPDATE " \
                        "service_id = VALUES(service_id), service_at_location_id = VALUES(service_at_location_id), " \
                        "opens_at = VALUES(opens_at), closes_at = VALUES(closes_at), " \
                        "valid_from = VALUES(valid_from), valid_to = VALUES(valid_to), " \
                        "dtstart = VALUES(dtstart), freq = VALUES(freq), `interval` = VALUES(`interval`), " \
                        "byday = VALUES(byday), bymonthday = VALUES(bymonthday), description = VALUES(description)"
                flat = [item for sublist in args for item in sublist]

                c = dbService.cursor()
                try:
                    c.execute(stmt, flat)
                except mysql.connector.Error as err:
                    print("Regular schedule")
                    print(textwrap.shorten(str(args), width=100))
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
            finally:
                self.closeDb([dbService])

    def update_attending_type(self):
        print("Updating attending type")
        dbService = self.openDb()
        try:
            stmt = "UPDATE service SET attending_type = 'online' WHERE id NOT IN (SELECT DISTINCT service_id FROM " \
                   "service_at_location INNER JOIN physical_address " \
                   "ON physical_address.location_id  = service_at_location.location_id)"
            c = dbService.cursor()
            try:
                c.execute(stmt)
            except mysql.connector.Error as err:
                print("Updating attending type")
                print(err)
            finally:
                c.close()
                dbService.commit()
        finally:
            self.closeDb([dbService])

    def openDb(self):
        connectService = mysql.connector.connect(
            host="",
            user="",
            passwd="",
            database=self.database)
        return connectService

    def closeDb(self, db):
        for item in db:
            item.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Importing data from csv into database")
    parser.add_argument("--db", required=True, type=str,
                        help="Name of the database to import into")
    parser.add_argument("--path", required=True, type=str,
                        help="A path to the import csv folder")
    arg = parser.parse_args()
    if arg.db in [None, ""]:
        sys.exit(1)
    if arg.path in [None, ""]:
        sys.exit(1)
    if arg.path[-1] != "/":
        arg.path += "/"
    print(arg.path)
    DataImport(arg.db, arg.path).importTables()
