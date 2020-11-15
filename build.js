/*
 * build.js - build the json UCD
 *
 * Copyright © 2020, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

var UnicodeFile = require("./unifile.js").UnicodeFile;

// "NamesList.txt": [],

var UCDFiles = require("./fields.json");

function fieldValue(fieldName, rawValue) {
    var name = fieldName.toLowerCase();
    if (name.indexOf("range") > -1) {
        return rawValue.split(/\.\./g);
    }
    if (name.indexOf("sequence") > -1 || name.indexOf("list") > -1) {
        return rawValue.split(/\s+/g);
    }
    return rawValue;
}

function processFiles(files, separator, output) {
    var UCDFileNames = Object.keys(files);
    for (var i = 0; i < UCDFileNames.length; i++) {
        var filename = UCDFileNames[i];
        var dirname = path.dirname(filename);
        var base = path.basename(filename, ".txt");
        var pathname = path.join("UCD", filename);
        var contents = {};
        contents[base] = [];
        var result = contents[base];

        var uf = new UnicodeFile({
            path: pathname,
            splitChar: separator
        });
        var fields = files[filename];

        for (var j = 0; j < uf.length(); j++) {
            var entry = {};
            uf.get(j).forEach(function(field, index) {
                var value = field.trim();
                if (fields.length < 2) {
                    result.push(value);
                    entry = undefined;
                } else {
                    var fieldName = fields[index];
                    if (value) {
                        entry[fieldName] = fieldValue(fieldName, value);
                    }
                }
            });
            if (entry) result.push(entry);
        }
        var outputFileName = path.join("json", dirname, base + ".json");
        output[outputFileName] = contents;
    }
}

function writeFiles(output) {
    for (var filename in output) {
        console.log("Writing " + filename);
        var pathname = path.dirname(filename);
        mkdirp.sync(pathname);
        fs.writeFileSync(filename, JSON.stringify(output[filename], undefined, 4), "utf-8");
    }
}

function postProcessSemiFiles(files) {
    var contents = files["json/PropertyValueAliases.json"].PropertyValueAliases;
    files["json/PropertyValueAliases.json"].PropertyValueAliases = contents.map(function(entry) {
        if (entry.field5) {
            return {
                "property": entry.property,
                "value1short": entry.field2,
                "value1long": entry.field3,
                "value2short": entry.field4,
                "value2long": entry.field5
            };
        } else if (entry.field4) {
            if (entry.property === "ccc") {
                return {
                    "property": entry.property,
                    "class": entry.field2,
                    "shortName": entry.field3,
                    "longName": entry.field4
                };
            } else {
                return {
                    "property": entry.property,
                    "shortName": entry.field2,
                    "longName": entry.field3,
                    "alias": entry.field4
                };
            }
        } else {
            return {
                "property": entry.property,
                "shortName": entry.field2,
                "longName": entry.field3
            };
        }
    });

    contents = files["json/BidiTest.json"].BidiTest;
    var levels, reorder;
    // first spread the levels and reorder to all the entries that
    // follow it until the next level or reorder line
    for (var i = 0; i < contents.length; i++) {
        var entry = contents[i];
        if (entry.input.startsWith("@Levels:")) {
            levels = entry.input.substring(9).trim();
        } else if (entry.input.startsWith("@Reorder:")) {
            reorder = entry.input.substring(10).trim();
        } else {
            if (levels) entry.levels = levels;
            if (reorder) entry.reorder = reorder;
        }
    }

    // now get rid or all of the level and reorder lines
    files["json/BidiTest.json"].BidiTest = contents.filter(function(entry) {
        return !entry.input.startsWith("@");
    });
}

function postProcessTabFiles(files) {
    for (var filename in files) {
        var contents = files[filename];
        var property = path.basename(filename, ".json");
        var fields = contents[property];
        var merged = {};
        for (var i = 0; i < fields.length; i++) {
            var entry = fields[i];
            merged[entry.description] = entry.codepoint;
        }
        var tmp = {};
        tmp[property] = merged;
        files[filename] = tmp;
    }
}

function postProcessNormalized(files) {
    for (var filename in files) {
        var contents = files[filename];
        var property = path.basename(filename, ".json");
        var fields = contents[property];
        var merged = {};
        for (var i = 0; i < fields.length; i++) {
            var entry = fields[i];
            if (!merged[entry.codepoint]) merged[entry.codepoint] = {};
            merged[entry.codepoint][entry.field] = entry.value;
        }
        var tmp = {};
        tmp[property] = merged;
        files[filename] = tmp;
    }
}

var contents = {};
processFiles(UCDFiles.semicolon, ";", contents);
postProcessSemiFiles(contents);
writeFiles(contents);

contents = {};
processFiles(UCDFiles.tab, "\t", contents);
postProcessTabFiles(contents);
writeFiles(contents);

contents = {};
processFiles(UCDFiles.normalized, "\t", contents);
postProcessNormalized(contents);
writeFiles(contents);
