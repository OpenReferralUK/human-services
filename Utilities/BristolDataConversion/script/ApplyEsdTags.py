# this script will apply ESD terms to the Bristol Well Aware data.
# the esd data has been prepared as a one-of excercise with LGA/Porism.
# this script shoudl only be run when a complete run has be done of the ConvertWellAwareDataToOorWithExtentions script to convert Bristol's Well-Aware data to Open Referral format.
# the file esdTag contains ESD terms ( See https://standards.esd.org.uk ) that are converted to the taxomonmy table.
# the file esdServiceType maps the service.csv table to the taxonomy terms.
# esdServiceType uses service_id whcih is generated during ConvertWellAwareDataToOorWithExtentions, so it assumes that the full conversion has been run, and that the original source files have not been changed.

import csv


def getUri(idTag):
    try:
        csv_in_esdTag = open('../WellAwareData/EsdTags/esdTag.csv')
    except IOError:
        raise FileNotFoundError("Error: esdTag.csv does not exist.")

    csv_reader_esdTag = csv.DictReader(csv_in_esdTag)

    uri = False

    for row_in_esdTag in csv_reader_esdTag:

        id = row_in_esdTag["id"]

        if id.strip() == idTag.strip():
            uri = row_in_esdTag['uri']
            break

    csv_in_esdTag.close()

    return uri


def main():
    print("Starting Esd Tags")
    try:
        csv_in_esdTag = open('../WellAwareData/EsdTags/esdTag.csv')
    except IOError:
        raise FileNotFoundError("Error: esdTag.csv does not exist.")

    csv_reader_esdTag = csv.DictReader(csv_in_esdTag)
    count_in_esdTag = 0

    try:
        csv_in_esdServiceType = open('../WellAwareData/EsdTags/esdServiceType.csv')
    except IOError:
        raise FileNotFoundError("Error: esdServiceType.csv does not exist.")

    csv_reader_esdServiceType = csv.DictReader(csv_in_esdServiceType)
    count_in_esdServiceType = 0

    try:
        csv_out_service_taxonomy = open('../OpenReferral/service_taxonomy.csv', mode='a')
    except IOError:
        raise PermissionError("Error: service_taxonomy.csv cannot be opened.")

    fields_service_taxonomy = [
        'id',
        'service_id',
        'taxonomy_id'
    ]
    writer_service_taxonomy = csv.DictWriter(csv_out_service_taxonomy, fieldnames=fields_service_taxonomy,
                                             quoting=csv.QUOTE_ALL)
    count_out_service_taxonomy = 0

    try:
        csv_out_taxonomy = open('../OpenReferral/taxonomy.csv', mode='a', encoding="UTF-8")
    except IOError:
        raise PermissionError("Error: taxonomy.csv cannot be opened.")

    fields_taxonomy = [
        'id',
        'name',
        'vocabulary'
    ]
    writer_taxonomy = csv.DictWriter(csv_out_taxonomy, fieldnames=fields_taxonomy, quoting=csv.QUOTE_ALL)
    count_out_taxonomy = 0

    for row_in_esdTag in csv_reader_esdTag:

        idTag = row_in_esdTag["id"]

        if idTag:
            row_taxonomy = {}

            count_out_taxonomy += 1

            row_taxonomy.update({'id': row_in_esdTag["uri"]})
            row_taxonomy.update({'name': row_in_esdTag["Label"]})
            row_taxonomy.update({'vocabulary': row_in_esdTag["Scheme"] + "s"})

            writer_taxonomy.writerow(row_taxonomy)

    csv_out_taxonomy.close()
    csv_in_esdTag.close()

    for row_in_esdServiceType in csv_reader_esdServiceType:

        idService = row_in_esdServiceType["idService"]

        if idService:
            uri = getUri(row_in_esdServiceType["idTag"])
            if uri:
                row_service_taxonomy = {}

                count_out_service_taxonomy += 1

                row_service_taxonomy.update({'id': 'esd:' + str(count_out_service_taxonomy)})
                row_service_taxonomy.update({'service_id': idService})
                row_service_taxonomy.update({'taxonomy_id': uri})

                writer_service_taxonomy.writerow(row_service_taxonomy)

    csv_out_service_taxonomy.close()
    print("Finished Esd Tags")


if __name__ == "__main__":
    main()
