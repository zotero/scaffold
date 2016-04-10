#!/bin/sh

# Make sure local tags are up to date with github repo
git fetch -t "https://github.com/zotero/scaffold.git"

lastTag="`git describe --tags --abbrev=0 --match=v[0-9]*`"

version="$1"
if [ -z "$version" ]; then
	echo "Last version: $lastTag" 1>&2
	read -p " New version: v" version
fi

srcPath="src"

##############
## Write changes since last release to change log
##############
changeLog="Changelog"
tempFile="`mktemp`"
tempFile2="`mktemp`"

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

minVersion="`grep -o -P -e '(?<=<em:minVersion>)[^<]+' $installRDF`"
newMinVersion=""
read -p "Update minVersion? [$minVersion] " newMinVersion

maxVersion="`grep -o -P -e '(?<=<em:maxVersion>)[^<]+' $installRDF`"
newMaxVersion=""
read -p "Update maxVersion? [$maxVersion] " newMaxVersion

if [ -z "$newMinVersion"]; then
	newMinVersion="$minVersion"
fi
if [ -z "$newMaxVersion"]; then
	newMaxVersion="$maxVersion"
fi

sed -i.bak "s/<em:version>[^<]*/<em:version>$version/; \
            s/<em:minVersion>[^<]*/<em:minVersion>$newMinVersion/; \
            s/<em:maxVersion>[^<]*/<em:maxVersion>$newMaxVersion/" \
    "$installRDF"
# Some SED versions require an extension, but we don't need a backup
rm "$installRDF.bak"

git commit -m "Update versions in install.rdf" "$installRDF" 1>&2

##############
## Create tag
##############
git tag "v$version"

##############
## Build XPI file
##############
./build.sh "$version"