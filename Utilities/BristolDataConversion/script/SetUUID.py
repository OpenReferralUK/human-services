import uuid
from contextlib import closing
from time import sleep

import mysql.connector


class AddUUID:
    def __init__(self, db):
        self.db = db
        self.header = {}
        self.services = []
        self.new_uuid = []
        self.uuid = {"organization": self.get_uuid_lookup("organization", self.db if self.db else "bristol"),
                     "service": self.get_uuid_lookup("service", self.db if self.db else "bristol"),
                     "location": self.get_uuid_lookup("location", self.db if self.db else "bristol")}

    def insert_new_uuid(self):
        dbService = openDb(self.db)

        flat = [item for sublist in self.new_uuid for item in sublist]
        if len(flat) == 0:
            return

        try:
            for i in range(len(self.new_uuid) // 100):
                # noinspection SyntaxError
                stmt = "INSERT INTO esd_external_id (uuid, external_id, origin, reference_table) VALUES " \
                       + ",".join("(%s, %s, %s, %s)" for _ in self.new_uuid[100 * i:100 * (i + 1)])
                c = dbService.cursor()
                try:
                    c.execute(stmt, flat[400 * i:400 * (i + 1)])
                except mysql.connector.Error as err:
                    print("failed inserting new uuids")
                    print(self.new_uuid[100 * i:100 * (i + 1)])
                    # print(stmt)
                    print(err)
                finally:
                    c.close()
                    dbService.commit()
        finally:
            closeDb([dbService])

    def get_uuid(self, external_id, table, origin):
        if self.uuid[table] is not None:
            if (str(external_id), origin if origin else "bristol") in self.uuid[table]:
                return self.uuid[table][str(external_id), origin if origin else "bristol"][0]

        new_uuid = str(uuid.uuid4())
        self.new_uuid.append([new_uuid, external_id, origin, table])
        self.uuid[table][external_id, origin] = [new_uuid, origin]
        return new_uuid

    def get_uuid_lookup(self, table, origin):
        print(f"Getting {table} uuids for {origin}")
        dbService = openDb(self.db)
        output = {}
        try:
            stmt = "SELECT uuid, external_id, origin FROM esd_external_id " \
                   "WHERE reference_table = %s and origin = %s group by uuid;"
            with closing(dbService.cursor(prepared=True)) as c:
                c.execute(stmt, (table, origin))
                for item in c:
                    if item is not None:
                        sleep(0.0000001)
                        output[item[1].decode(), item[2].decode()] = [item[0].decode(), item[2].decode()]
        finally:
            closeDb([dbService])
        return output


# noinspection SpellCheckingInspection
def openDb(db):
    connectService = mysql.connector.connect(
        host="",
        user="",
        passwd="",
        database="ServiceDirectory" + db)
    return connectService


def closeDb(db_list):
    for item in db_list:
        if item is None:
            continue
        else:
            item.close()


if __name__ == "__main__":
    AddUUID("")
