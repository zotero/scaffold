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

git add "$changeLog"

##############
## Update install.rdf
##############
installRDF="$srcPath/install.rdf"

minVersion=`perl -ne 'print m/<em:minVersion>([^<]+)/;' $installRDF`
newMinVersion=""
read -p "Update minVersion? [$minVersion] " newMinVersion

maxVersion=`perl -ne 'print m/<em:maxVersion>([^<]+)/;' $installRDF`
newMaxVersion=""
read -p "Update maxVersion? [$maxVersion] " newMaxVersion

if [ -z "$newMinVersion"]; then
	newMinVersion="$minVersion"
fi
if [ -z "$newMaxVersion"]; then
	newMaxVersion="$maxVersion"
fi

perl -pi -e "s/<em:version>[^<]*/<em:version>$version/;" \
          -e "s/<em:minVersion>[^<]*/<em:minVersion>$newMinVersion/;" \
          -e "s/<em:maxVersion>[^<]*/<em:maxVersion>$newMaxVersion/;" \
    $installRDF
rm "$installRDF.bak"

git add "$installRDF"

##############
## Build XPI file
##############
./build.sh "$version"

# Cygwin has sha1sum, macOS has shasum, Linux has both
if [[ -n "`which sha1sum 2> /dev/null`" ]]; then
    SHACMD="sha1sum"
else
    SHACMD="shasum"
fi
SHA1=`$SHACMD build/scaffold-$version.xpi | cut -d' ' -f1`


##############
## Update docs/ for Github Pages
##############

perl -pi -e "s/<em:version>[^<]*/<em:version>$version/;" \
          -e "s/<em:updateLink>[^<]*/<em:updateLink>https:\/\/github.com\/zotero\/scaffold\/releases\/download\/v$version\/scaffold-$version.xpi/;" \
          -e "s/sha1:/sha1:$SHA1/g;" \
          -e "s/<em:updateInfoURL>[^<]*/<em:updateInfoURL>https:\/\/github.com\/zotero\/scaffold\/releases\/tag\/v$version/;" \
    docs/scaffold.rdf
git add "docs/scaffold.rdf"

##############
## Commit everything
##############

git commit -m "Release $version" 1>&2

##############
## Create tag
##############
git tag "v$version"
