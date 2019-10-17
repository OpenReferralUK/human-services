def execute(db, stmt, args, type="dictionary", result=True):
    if type == "dictionary":
        cursor = db.cursor(dictionary=True)
    elif type == "prepared":
        cursor = db.cursor(prepared=True)
    else:
        cursor = db.cursor()

    cursor.execute(stmt, args)
    if result:
        result = cursor.fetchall()

    cursor.close()

    if result:
        return result
