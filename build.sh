#!/bin/bash

find . -name '.hg' -prune -o \
       -name '.hgtags' -prune -o \
       -name '.svn' -prune -o \
       -name '.git' -prune -o \
       -name '.hgignore' -prune -o \
       -name '.xpi' -prune -o \
       -name 'fw-update.sh' -prune -o \
       -name 'build.sh' -prune -o \
       -name '*~' -prune -o \
       -print | xargs zip scaffold.xpi
