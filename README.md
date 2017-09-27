Scaffold is an integrated development environment for creating
[Zotero](https://www.zotero.org/) [translators](https://github.com/zotero/translators/).


## Build and release

To build the XPI installer, enter this directory and run build.sh:

    ./build.sh [VERSION]

This will create a file scaffold.xpi, which you can add as an addon
in Zotero. Basically it just adds all files in `src` to zip file which
is names specially.

For releasing a new version you can use the command:

    ./release VERSION


## Development

Create a text file containing simply the path to the `src` folder,
name this file `scaffold@zotero.org` and place it in the extenstion
folder of Zotero, and restart it.
 

## LICENSE

Scaffold uses:
* the Ajax.org Cloud9 Editor [ACE](https://ace.c9.io/),
licensed under the Mozilla Tri-License (MPL, GPL, LGPL).
* some icons from the [FamFamFam Silk icon set](http://www.famfamfam.com/lab/icons/silk/), licensed under Creative
Commons Attribution 2.5.

Scaffold itself is part of the larger Zotero project, produced by the Center
for History and New Media at George Mason University, and is licensed under
the Affero GPL 3.0.
