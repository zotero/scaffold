#!/usr/bin/env python

# A small python script that dumps a serialized JSON
# object representing the field names in a Zotero item.
# The dumped object can be included in the scaffold
# code, to provide human-readable names for item
# fields.

# To run the script, close Firefox to release access
# to the zotero.sqlite file, and run the script.
# This will write a config file to disk as
# getFieldNameJson.cfg.  Edit the "db" path in the
# config file to point at an appropriate zotero.sqlite
# file, and run the script again to dump the object
# to standard output.

import sys,os
from pysqlite2 import dbapi2
from ConfigParser import ConfigParser
import json

mypath,myname = os.path.split(sys.argv[0])
mybase,myext = os.path.splitext(myname)
os.chdir(mypath)

cp = ConfigParser()
config = os.path.join(mypath, "%s.cfg" % mybase)

if not os.path.exists(config):
    cp.add_section("paths")
    cp.set("paths", "db", "/home/bennett/.mozilla/firefox/2bem3nky.default/zotero/zotero.sqlite")
    cp.write(open(config, "wb"))
else:
    cp.read(config)

conn = dbapi2.connect(cp.get("paths", "db"))
got = conn.execute("SELECT fieldID,fieldName from fields ORDER BY fieldID");

fields = []

count = 0;
for row in got:
    while count < int(row[0]):
        fields.append("???")
        count += 1
    fields.append(row[1])
    count += 1

sys.stdout.write("var fieldnames = ")

sys.stdout.write(json.dumps(fields,indent=4,sort_keys=False,ensure_ascii=False))

sys.stdout.write("\n")

conn.close()
