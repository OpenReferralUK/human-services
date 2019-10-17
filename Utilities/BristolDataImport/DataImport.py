import utils.db as db

import csv
import mysql
import mysql.connector


def importTables():
    dbServiceDir = openDb()
    try:
        organization(dbServiceDir)
        #
        service(dbServiceDir)

        #
        contact(dbServiceDir)
        service_at_location(dbServiceDir)
        accessibility_for_disabilities(dbServiceDir)
        eligibility(dbServiceDir)
        funding(dbServiceDir)
        service_area(dbServiceDir)
        link_taxonomy(dbServiceDir)
        service_taxonomy(dbServiceDir)
        review(dbServiceDir)
        #
        phone(dbServiceDir)
        regular_schedule(dbServiceDir)
        holiday_schedule(dbServiceDir)
        cost_option(dbServiceDir)
        location(dbServiceDir)
        #
        physical_address(dbServiceDir)

    finally:
        closeDb([dbServiceDir])


def organization(dbService):
    print("Organization")
    with open("../OpenReferral/organization.csv", "r") as organization:
        csv_in_service = csv.DictReader(organization)

        stmt = "DELETE FROM organization"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO organization (id, name, description, url, logo, uri) VALUES (%s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_service:
            args = (row["id"],
                    row["name"],
                    row["description"],
                    row["url"],
                    row["logo"],
                    row["uri"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def service(dbService):
    print("Service")
    with open("../OpenReferral/service.csv", "r") as service:
        csv_in_service = csv.DictReader(service)

        stmt = "DELETE FROM service"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO service (id, organization_id, name, description, url, email, status, fees," \
               " accreditations, deliverable_type, attending_type, attending_access)" \
               " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_service:
            args = (row["id"],
                    row["organization_id"],
                    row["name"],
                    row["description"],
                    row["url"],
                    row["email"],
                    row["status"],
                    row["fees"],
                    row["accreditations"],
                    row["deliverable_type"],
                    row["attending_type"],
                    row["attending_access"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def accessibility_for_disabilities(dbService):
    print("Accessibility for disabilities")
    with open("../OpenReferral/accessibility_for_disabilities", "r") as accessibility_for_disabilities:
        csv_in_accessibility_for_disabilities = csv.DictReader(accessibility_for_disabilities)

        stmt = "DELETE FROM accessibility_for_disabilities"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO accessibility_for_disabilities (id, location_id, accessibility) VALUES (%s, %s, %s)"

        i = 0
        for row in csv_in_accessibility_for_disabilities:
            args = (row["id"],
                    row["location_id"],
                    row["accessibility"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def taxonomy(dbService):
    print("Taxonomy")
    with open("../OpenReferral/taxonomy", "r") as taxonomy:
        csv_in_taxonomy = csv.DictReader(taxonomy)

        stmt = "DELETE FROM taxonomy"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO taxonomy (id, name, vocabulary, parent_id) VALUES (%s, %s, %s, %s)"

        i = 0
        for row in csv_in_taxonomy:
            args = (row["id"],
                    row["location_id"],
                    row["accessibility"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def eligibility(dbService):
    print("Eligibility")
    with open("../OpenReferral/eligibility.csv", "r") as eligibility:
        csv_in_eligibility = csv.DictReader(eligibility)

        stmt = "DELETE FROM eligibility"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO eligibility (id, service_id, eligibility) VALUES (%s, %s, %s)"

        i = 0
        for row in csv_in_eligibility:
            args = (row["id"],
                    row["service_id"],
                    row["eligibility"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def review(dbService):
    print("Review")
    with open("../OpenReferral/review.csv", "r") as review:
        csv_in_review = csv.DictReader(review)

        stmt = "DELETE FROM review"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO review (id, service_id, reviewer_organization_id, title, description, date, score," \
               "url, widget) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_review:
            args = (row["id"],
                    row["service_id"],
                    row["reviewer_organization_id"],
                    row["title"],
                    row["description"],
                    row["date"],
                    row["score"],
                    row["url"],
                    row["widget"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def funding(dbService):
    print("Funding")
    with open("../OpenReferral/funding.csv", "r") as funding:
        csv_in_funding = csv.DictReader(funding)

        stmt = "DELETE FROM funding"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO funding (id, service_id, source) VALUES (%s, %s, %s)"

        i = 0
        for row in csv_in_funding:
            args = (row["id"],
                    row["service_id"],
                    row["source"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def link_taxonomy(dbService):
    print("Link Taxonomy")
    with open("../OpenReferral/link_taxonomy.csv", "r") as link_taxonomy:
        csv_in_link_taxonomy = csv.DictReader(link_taxonomy)

        stmt = "DELETE FROM link_taxonomy"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO link_taxonomy (id, link_type, link_id, taxonomy_id) VALUES (%s, %s, %s, %s)"

        i = 0
        for row in csv_in_link_taxonomy:
            args = (row["id"],
                    row["link_type"],
                    row["link_id"],
                    row["taxonomy_id"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def service_taxonomy(dbService):
    print("Service taxonomy")
    with open("../OpenReferral/service_taxonomy.csv", "r") as service_taxonomy:
        csv_in_location = csv.DictReader(service_taxonomy)

        stmt = "DELETE FROM service_taxonomy"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO service_taxonomy (id, service_id, taxonomy_id) VALUES (%s, %s, %s)"

        i = 0
        for row in csv_in_location:
            args = (row["id"],
                    row["service_id"],
                    row["taxonomy_id"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def service_area(dbService):
    print("Service area")
    with open("../OpenReferral/service_area.csv", "r") as service_area:
        csv_in_location = csv.DictReader(service_area)

        stmt = "DELETE FROM service_area"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO service_area (id, service_id, service_area, extent, uri) VALUES (%s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_location:
            args = (row["id"],
                    row["service_id"],
                    row["service_area"],
                    row["extent"],
                    row["uri"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def service_at_location(dbService):
    print("Service at location")
    with open("../OpenReferral/service_at_location.csv", "r") as service_at_location:
        csv_in_location = csv.DictReader(service_at_location)

        stmt = "DELETE FROM service_at_location"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO service_at_location (id, service_id, location_id) VALUES (%s, %s, %s))"

        i = 0
        for row in csv_in_location:
            args = (row["id"],
                    row["service_id"],
                    row["location_id"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def location(dbService):
    print("Location")
    with open("../OpenReferral/location.csv", "r") as location:
        csv_in_location = csv.DictReader(location)

        stmt = "DELETE FROM location"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO location (id, name, description, latitude, longitude) VALUES (%s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_location:
            args = (row["id"],
                    row["name"],
                    row["description"],
                    row["latitude"],
                    row["longitude"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def physical_address(dbService):
    print("Physical address")
    with open("../OpenReferral/physical_address.csv", "r") as physicalAddress:
        csv_in_physical_address = csv.DictReader(physicalAddress)

        stmt = "DELETE FROM physical_address"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO physical_address (id, location_id, address_1, city, state_province, " \
               "postal_code, country, attention) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_physical_address:
            args = (row["id"],
                    row["location_id"],
                    row["address_1"],
                    row["city"],
                    row["state_province"],
                    row["postal_code"],
                    row["country"],
                    row["attention"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def contact(dbService):
    print("Contact")
    with open("../OpenReferral/contact.csv", "r") as contact:
        csv_in_contact = csv.DictReader(contact)

        stmt = "DELETE FROM contact"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO contact (id, service_id, name, title) values (%s, %s, %s, %s)"

        i = 0
        for row in csv_in_contact:
            args = (row["id"],
                    row["service_id"],
                    row["name"],
                    row["title"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def cost_option(dbService):
    print("Cost Option")
    with open("../OpenReferral/cost_option.csv", "r") as costOption:
        csv_in_cost_option_schedule = csv.DictReader(costOption)

        stmt = "DELETE FROM cost_option"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO cost_option (id, service_id, valid_from, valid_to, `option`, amount)" \
               " VALUES (%s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_cost_option_schedule:
            args = (row["id"],
                    row["service_id"],
                    row["valid_from"],
                    row["valid_to"],
                    row["option"],
                    row["amount"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def phone(dbService):
    print("Phone")
    with open("../OpenReferral/phone.csv", "r") as phone:
        csv_in_phone_schedule = csv.DictReader(phone)

        stmt = "DELETE FROM phone"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO phone (id, contact_id, number, language) VALUES (%s, %s, %s, %s)"

        i = 0
        for row in csv_in_phone_schedule:
            args = (row["id"],
                    row["contact_id"],
                    row["number"],
                    row["language"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def holiday_schedule(dbService):
    print("Holiday Schedule")
    with open("../OpenReferral/holiday_schedule.csv", "r") as holidaySchedule:
        csv_in_holiday_schedule = csv.DictReader(holidaySchedule)

        stmt = "DELETE FROM holiday_schedule"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO holiday_schedule (id, service_id, service_at_location_id, closed, opens_at, closes_at," \
               " start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_holiday_schedule:
            args = (row["id"],
                    row["service_id"],
                    row["service_at_location_id"],
                    row["closed"],
                    row["opens_at"],
                    row["closes_at"],
                    row["start_date"],
                    row["end_date"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def regular_schedule(dbService):
    print("Regular Schedule")
    with open("../OpenReferral/regular_schedule.csv", "r") as regularSchedule:
        csv_in_regular_schedule = csv.DictReader(regularSchedule)

        stmt = "DELETE FROM regular_schedule"

        db.execute(dbService, stmt, (), "", False)

        dbService.commit()

        stmt = "INSERT INTO regular_schedule (id, service_id, service_at_location_id, opens_at, closes_at, " \
               "valid_from, valid_to, dtstart, freq, `interval`, byday, bymonthday, description) " \
               "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

        i = 0
        for row in csv_in_regular_schedule:
            args = (row["id"],
                    row["service_id"],
                    row["service_at_location_id"],
                    row["opens_at"],
                    row["closes_at"],
                    row["valid_from"],
                    row["valid_to"],
                    row["dtstart"],
                    row["freq"],
                    row["interval"],
                    row["byday"],
                    row["bymonthday"],
                    row["description"])
            try:
                db.execute(dbService, stmt, args, "", False)
            except mysql.connector.Error as err:
                print(row)
                print(err)
            if ((i % 100) == 0) and i != 0:
                dbService.commit()
                print(i)
            i += 1
        dbService.commit()


def openDb():
    connectService = mysql.connector.connect(
        host="",
        user="",
        passwd="",
        database="ServiceDirectory")
    return connectService


def closeDb(db):
    for item in db:
        item.close()


if __name__ == "__main__":
    importTables()
    # dbService = openDb()
    # try:
    #     contact(dbService)
    #     phone(dbService)
    # except mysql.connector.Error as err:
    #     print(err)
    # finally:
    #     closeDb([dbService])
