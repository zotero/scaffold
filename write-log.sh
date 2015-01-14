#!/bin/bash

CHANGELOG="Changelog"
TEMPFILE="`mktemp`"
LASTTAG="`git tag -l v[0-9]* | tail -n 1`"

echo "Version $1" > "$TEMPFILE"
git log "$LASTTAG".. --reverse --no-merges --format="* %s" >> "$TEMPFILE"
echo "" >> "$TEMPFILE"

cat "$CHANGELOG" >> "$TEMPFILE"

mv "$TEMPFILE" "$CHANGELOG"