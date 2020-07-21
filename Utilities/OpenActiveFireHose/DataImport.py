import mysql.connector

db = None


class DataImport:
    def __init__(self, dbImport):
        """
        Imports data into a ORUK database
        :type self.dbImport: Union[CMySQLConnection, MySQLConnection]
        """
        self.args = {}
        self.db = dbImport

    def insert_all(self, args):
        """
        :type args: dict[List[List[any]]]
        """
        self.args = args
        self.insert_organization()
        self.insert_service()
        self.insert_taxonomy()
        self.insert_eligibility()
        self.insert_contact()
        self.insert_phone()
        self.insert_location()
        self.insert_service_at_location()
        self.insert_physical_address()
        self.insert_cost_option()
        self.insert_regular_schedule()
        self.insert_accessibility_for_disabilities()
        self.insert_service_taxonomy()
        self.insert_review()
        self.insert_link_taxonomy()

    def insert_organization(self):
        if len(self.args["organization"]) == 0:
            return
        stmt = "INSERT INTO organization (id, `name`, description, url, logo, uri) VALUES " + ",".join(
            "(%s, %s, %s, %s, %s, %s)" for _ in self.args["organization"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "`name` = VALUES(`name`), description = VALUES(description), url = VALUES(url), " \
                "logo = VALUES(logo), uri = VALUES(uri)"
        flat = [item for sublist in self.args["organization"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["organization"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_service(self):
        if len(self.args["service"]) == 0:
            return
        stmt = "INSERT INTO service (id, organization_id, name, description, url, email, status, fees, " \
               "accreditations, deliverable_type) " \
               "VALUES " + ",".join("(%s, %s,%s, %s,%s, %s,%s, %s,%s, %s)" for _ in self.args["service"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "name = VALUES(name), description = VALUES(description), " \
                "url = VALUES(url), email = VALUES(email), status = VALUES(status), fees = VALUES(fees), " \
                "accreditations = VALUES(accreditations), deliverable_type = VALUES(deliverable_type)"
        flat = [item for sublist in self.args["service"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["service"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_accessibility_for_disabilities(self):
        if len(self.args["accessibility"]) == 0:
            return
        stmt = "INSERT INTO accessibility_for_disabilities (id, location_id, accessibility) VALUES " + ",".join(
            "(%s, %s, %s)" for _ in self.args["accessibility"])
        stmt += "ON DUPLICATE KEY UPDATE location_id = VALUES(location_id), accessibility = VALUES(accessibility);"
        flat = [item for sublist in self.args["accessibility"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["accessibility"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_taxonomy(self):
        if len(self.args["taxonomy"]) == 0:
            return
        stmt = "INSERT INTO taxonomy (id, name, vocabulary, parent_id) VALUES " + ",".join(
            "(%s, %s, %s, %s)" for _ in self.args["taxonomy"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "name = VALUES(name), vocabulary = VALUES(vocabulary), parent_id = NULL"
        flat = [item for sublist in self.args["taxonomy"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["taxonomy"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_eligibility(self):
        if len(self.args["eligibility"]) == 0:
            return
        stmt = "INSERT INTO eligibility (id, service_id, eligibility, minimum_age, maximum_age) VALUES " + ",".join(
            "(%s, %s, %s, %s, %s)" for _ in self.args["eligibility"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "service_id = VALUES(service_id), eligibility = VALUES(eligibility), " \
                "minimum_age = VALUES(minimum_age), maximum_age = VALUES(maximum_age)"
        flat = [item for sublist in self.args["eligibility"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["eligibility"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_review(self):
        if len(self.args["review"]) == 0:
            return
        stmt = "INSERT INTO review (id, service_id, reviewer_organization_id, title, description, date, score, " \
               "url, widget) VALUES " + ",".join("(%s, %s, %s, %s, %s, %s, %s, %s, %s)" for _ in self.args["review"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "service_id = VALUES(service_id), reviewer_organization_id = VALUES(reviewer_organization_id), title = VALUES(title), " \
                "description = VALUES(description), date = VALUES(date), score = VALUES(score), url = VALUES(url),  widget = VALUES(widget)"
        flat = [item for sublist in self.args["review"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["review"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_funding(self, args):
        if len(self.args["funding"]) == 0:
            return
        stmt = "INSERT INTO funding (id, service_id, source) VALUES (%s, %s, %s) " \
               "ON DUPLICATE KEY UPDATE " \
               "source = VALUES(source)"

        try:
            self.db.execute(self.db, stmt, args, "prepared", False)
        except mysql.connector.Error as err:
            print(args)
            print(err)

    def insert_link_taxonomy(self):
        if len(self.args["link_taxonomy"]) == 0:
            return
        stmt = "INSERT INTO link_taxonomy (id, link_type, link_id, taxonomy_id) VALUES " + ",".join(
            "(%s, %s, %s, %s)" for _ in self.args["link_taxonomy"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "link_type = VALUES(link_type), link_id = VALUES(link_id), taxonomy_id = VALUES(taxonomy_id)"

        flat = [item for sublist in self.args["link_taxonomy"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["review"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_service_taxonomy(self):
        if len(self.args["service_taxonomy"]) == 0:
            return

        flat = [item for sublist in self.args["service_taxonomy"] for item in sublist]
        for i in range(-(len(self.args["service_taxonomy"]) // -50)):

            stmt = "INSERT INTO service_taxonomy (id, service_id, taxonomy_id) VALUES " + ",".join(
                "(%s, %s, %s)" for _ in self.args["service_taxonomy"][50 * i:50 * (i + 1)])
            stmt += " ON DUPLICATE KEY UPDATE " \
                    "service_id = VALUES(service_id), taxonomy_id = VALUES(taxonomy_id)"
            c = self.db.cursor()
            try:
                c.execute(stmt, flat[150 * i:150 * (i + 1)])
            except mysql.connector.Error as err:
                print(flat[150 * i:150 * (i + 1)])
                # print(stmt)
                print(err)
            finally:
                c.close()
                self.db.commit()

    def insert_service_area(self, args):
        if len(self.args["service_area"]) == 0:
            return
        stmt = "INSERT INTO service_area (id, service_id, service_area, extent, uri) VALUES (%s, %s, %s, %s, %s) " \
               "ON DUPLICATE KEY UPDATE " \
               "service_id = VALUES(service_id), service_area = VALUES(service_area), uri = VALUES(uri)"

        try:
            self.db.execute(self.db, stmt, args, "prepared", False)
        except mysql.connector.Error as err:
            print(args)
            print(err)

    def insert_service_at_location(self):
        if len(self.args["service_at_location"]) == 0:
            return
        stmt = "INSERT INTO service_at_location (id, service_id, location_id) VALUES " + ",".join(
            "(%s, %s, %s)" for _ in self.args["service_at_location"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "service_id = VALUES(service_id), location_id = VALUES(location_id)"
        flat = [item for sublist in self.args["service_at_location"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["service_at_location"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_location(self):
        if len(self.args["location"]) == 0:
            return
        stmt = "INSERT INTO location (id, name, description, latitude, longitude) VALUES " + ",".join(
            "(%s, %s, %s, %s, %s)" for _ in self.args["location"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "name = VALUES(name), description = VALUES(description), " \
                "latitude = VALUES(latitude), longitude = VALUES(longitude)"
        flat = [item for sublist in self.args["location"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["location"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_physical_address(self):
        if len(self.args["physical_address"]) == 0:
            return
        stmt = "INSERT INTO physical_address (id, location_id, address_1, city, state_province, " \
               "postal_code, country, attention) VALUES " + \
               ",".join("(%s, %s, %s, %s, %s, %s, %s, %s)" for _ in self.args["physical_address"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "location_id = VALUES(location_id), address_1 = VALUES(address_1), city = VALUES(city), " \
                "state_province = VALUES(state_province), postal_code = VALUES(postal_code), " \
                "country = VALUES(country)"
        flat = [item for sublist in self.args["physical_address"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["physical_address"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_contact(self):
        if len(self.args["contact"]) == 0:
            return
        stmt = "INSERT INTO contact (id, service_id, name, title) values " + ",".join(
            "(%s, %s, %s, %s)" for _ in self.args["contact"])
        stmt += " ON DUPLICATE KEY UPDATE " \
                "service_id = VALUES(service_id), name = VALUES(name), title = VALUES(title)"
        flat = [item for sublist in self.args["contact"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["contact"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_cost_option(self):
        if len(self.args["cost_option"]) == 0:
            return
        stmt = "INSERT INTO cost_option (id, service_id, valid_from, valid_to, `option`, amount, amount_description) " \
               "VALUES " + ",".join("(%s, %s, %s, %s, %s, %s, %s)" for _ in self.args["cost_option"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "service_id = VALUES(service_id), valid_from = VALUES(valid_from), valid_to = VALUES(valid_to), " \
                "`option` = VALUES(`option`), amount = VALUES(amount)"
        flat = [item for sublist in self.args["cost_option"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["cost_option"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_phone(self):
        if len(self.args["phone"]) == 0:
            return
        stmt = "INSERT INTO phone (id, contact_id, number, language) VALUES " + ",".join(
            "(%s, %s, %s, %s)" for _ in self.args["phone"])
        stmt += "ON DUPLICATE KEY UPDATE " \
                "contact_id = VALUES(contact_id), number = VALUES(number), language = VALUES(language)"
        flat = [item for sublist in self.args["phone"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["phone"])
            print(err)
        finally:
            c.close()
            self.db.commit()

    def insert_holiday_schedule(self, args):
        stmt = "INSERT INTO holiday_schedule (id, service_id, service_at_location_id, closed, opens_at, " \
               "closes_at, start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) " \
               "ON DUPLICATE KEY UPDATE " \
               "service_id = VALUES(service_id), service_at_location_id = VALUES(service_at_location_id), " \
               "closed = VALUES(closed), opens_at = VALUES(opens_at), closes_at = VALUES(closes_at), " \
               "start_date = VALUES(start_date), end_date = VALUES(end_date)"

        try:
            self.db.execute(self.db, stmt, args, "prepared", False)
        except mysql.connector.Error as err:
            print(args)
            print(err)

    def insert_regular_schedule(self):
        if len(self.args["regular_schedule"]) == 0:
            return
        stmt = "INSERT INTO regular_schedule (id, service_id, service_at_location_id, opens_at, closes_at, " \
               "valid_from, valid_to, dtstart, freq, `interval`, byday, bymonthday, description) VALUES" + \
               ",".join("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" for _ in self.args["regular_schedule"])
        stmt += " ON DUPLICATE KEY UPDATE " \
                "service_id = VALUES(service_id), service_at_location_id = VALUES(service_at_location_id), " \
                "opens_at = VALUES(opens_at), closes_at = VALUES(closes_at), valid_from = VALUES(valid_from), " \
                "valid_to = VALUES(valid_to), dtstart = VALUES(dtstart), freq = VALUES(freq), " \
                "`interval` = VALUES(`interval`), byday = VALUES(byday), bymonthday = VALUES(bymonthday), " \
                "description = VALUES(description)"
        flat = [item for sublist in self.args["regular_schedule"] for item in sublist]
        c = self.db.cursor()
        try:
            c.execute(stmt, flat)
        except mysql.connector.Error as err:
            print(self.args["regular_schedule"])
            print(err)
        finally:
            c.close()
            self.db.commit()
