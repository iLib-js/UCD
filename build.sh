UCD_VERSION=$1

if [ ! -d "UCD" ]
then
    . ./download.sh ${UCD_VERSION}
fi

mkdir -p json

node build.js
cp package.json README.md LICENSE json
pushd json

npm pack

mv *.tgz ..
