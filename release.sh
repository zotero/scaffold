#!/bin/sh

version="$1"
if [ -z "$version" ]; then
	read -p "Version number: " version
fi

srcPath="src"

##############
## Write changes since last release to change log
##############
changeLog="Changelog"
tempFile="`mktemp`"
tempFile2="`mktemp`"
lastTag="`git tag -l v[0-9]* | tail -n 1`"

git log --reverse --no-merges --format="* %s" "$lastTag".. "$srcPath" >> "$tempFile"
${VISUAL:-${EDITOR:-vi}} "$tempFile"

echo "Version $version" > "$tempFile2"
cat "$tempFile" >> "$tempFile2"
echo "" >> "$tempFile2"
cat "$changeLog" >> "$tempFile2"

rm "$tempFile"
mv "$tempFile2" "$changeLog"

git commit -m "Update change log" "$changeLog" 1>&2

##############
## Update install.rdf
##############
installRDF="$srcPath/install.rdf"
sed -i.bak "s/<em:version>[^<]*<\/em:version>/<em:version>$version<\/em:version>/" "$installRDF"
# Some SED versions require an extension, but we don't need a backup
rm "$installRDF.bak"

git commit -m "Update version" "$installRDF" 1>&2

##############
## Create tag
##############
git tag "v$version"

##############
## Build XPI file
##############
./build.sh "$version"