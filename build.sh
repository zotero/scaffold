#!/bin/bash

buildDir="build"
rm -rf "$buildDir"
mkdir "$buildDir"

version=""
if [ ! -z "$1" ]; then
	version="-$1"
fi
buildPath="$buildDir/scaffold$version.xpi"

(cd src && zip -r "../$buildPath" * 1>&2)
zip "$buildPath" Changelog 1>&2

echo "$buildPath"