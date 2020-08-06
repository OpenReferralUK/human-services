## Open Active Firehose API conversion to ORUK

This script reads the imin Firehose Open Active session-series feed at https://firehose.imin.co/firehose/session-series and converts it into an ORUK complient database.

Connection string for the database needs to be configured in:
firehose_openactive.py line 304
SetUUID.py line 74

X-API-KEY needs to be set at 
firehose_openactive.py line 51
