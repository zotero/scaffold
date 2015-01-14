#!/bin/bash

changeLog="Changelog"
tempFile="`mktemp`"
lastTag="`git tag -l v[0-9]* | tail -n 1`"

echo "Version $1" > "$tempFile"
git log --reverse --no-merges --format="* %s" "$lastTag".. src >> "$tempFile"
echo "" >> "$tempFile"

cat "$changeLog" >> "$tempFile"

mv "$tempFile" "$changeLog"