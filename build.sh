if [ ! -d "UCD" ]
then
    . ./download.sh ${npm_package_version}
fi

mkdir -p json

node build.js
cp package.json README.md LICENSE CHANGELOG.md json
pushd json

npm pack

mv *.tgz ..
