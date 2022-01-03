#!/bin/sh

echo "CIRCLECI_TAG=$CIRCLECI_TAG, \$1=$1"

VERSION="${$1#[vV]}"
MAJOR="${VERSION%%\.*}"
MINOR="${VERSION#*.}"
MINOR="${MINOR%.*}"
PATCH="${VERSION##*.}"

echo "export MAJOR_TAG=v$MAJOR" >> $BASH_ENV
echo "export MINOR_TAG=v$MAJOR.$MINOR" >> $BASH_ENV
echo "export PATCH_TAG=v$MAJOR.$MINOR.$PATCH" >> $BASH_ENV
