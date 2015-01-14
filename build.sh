#!/bin/bash
buildDir="build"
rm -rf "$buildDir"
mkdir "$buildDir"

buildPath="$buildDir/scaffold.xpi"

(cd src && zip -r "../$buildPath" *)
zip "$buildPath" Changelog