#!/bin/sh

VERSION="${CIRCLECI_TAG#[vV]}"
MAJOR="${VERSION%%\.*}"
MINOR="${VERSION#*.}"
MINOR="${MINOR%.*}"
PATCH="${VERSION##*.}"

echo "export MAJOR_TAG=v$MAJOR" >> $BASH_ENV
echo "export MINOR_TAG=v$MAJOR.$MINOR" >> $BASH_ENV
echo "export PATCH_TAG=v$MAJOR.$MINOR.$PATCH" >> $BASH_ENV
