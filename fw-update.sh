#!/bin/bash

# Updates the translator framework inside Scaffold
# By Avram Lyon
# In the public domain. Enjoy, improve.

SCAFFOLD=/home/ajlyon/development/zotero/scaffold/chrome/content/scaffold/scaffold.js
FRAMEWORK=/home/ajlyon/development/zotero/zotero-transfw/framework.min.js

echo Previous version:
grep -m1 -o -E "FW LINE [0-9]+:[a-f0-9]{12}" $SCAFFOLD

sed -i -e "/\/\* FW LINE [0-9]\+:[0-9a-f]\{12\}.*/ { r $FRAMEWORK" -e 'd; }' $SCAFFOLD;
sed -i -e "s|^/\* FW LINE [0-9]\+:[0-9a-f]\{12\}.*|	var _FW = '\0';\n|" $SCAFFOLD;

echo Current version:
grep -m1 -o -E "FW LINE [0-9]+:[a-f0-9]{12}" $SCAFFOLD
