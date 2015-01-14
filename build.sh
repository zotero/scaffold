#!/bin/bash

find . -name '.git' -prune -o \
       -name '.gitignore' -prune -o \
       -name '*.xpi' -prune -o \
       -name '*.sh' -prune -o \
       -name '*~' -prune -o \
       -print | xargs zip scaffold.xpi
