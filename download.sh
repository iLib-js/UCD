#!/bin/bash

UCD_VERSION=$1

if [ "${UCD_VERSION}" = "" ]
then
    echo No UCD version specified. Using "latest".
    UCD_VERSION="latest"
fi

rm -rf UCD
mkdir UCD
pushd UCD

wget -r --limit-rate=50k --no-host-directories --cut-dirs=7 -L -np -e robots=off http://www.unicode.org/Public/zipped/$UCD_VERSION/UCD.zip
wget -r --limit-rate=50k --no-host-directories --cut-dirs=7 -L -np -e robots=off http://www.unicode.org/Public/zipped/$UCD_VERSION/Unihan.zip
wget -r --limit-rate=50k --no-host-directories --cut-dirs=7 -L -np -e robots=off http://www.unicode.org/iso15924/iso15924.txt
unzip UCD.zip
unzip Unihan.zip

rm -rf __MACOSX
popd
