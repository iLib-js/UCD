#!/bin/bash

UCD_VERSION=$1

if [ "${UCD_VERSION}" = "" ]
then
    echo No UCD version specified. Try again and give the version in the first parameter.
    exit 1
fi

mkdir UCD
pushd UCD

wget https://unicode.org/Public/${UCD_VERSION}/ucd/UCD.zip
wget https://unicode.org/Public/${UCD_VERSION}/ucd/Unihan.zip

unzip UCD.zip
unzip Unihan.zip

popd

