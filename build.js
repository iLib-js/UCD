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

var UnicodeFile = require("ilib-data-utils").UnicodeFile;

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

function processFiles(files, output, options) {
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
            splitChar: options.splitChar,
            commentString: options.commentString,
            multilineComments: options.multilineComments
        });
        var fields = files[filename];

        for (var j = 0; j < uf.length(); j++) {
            var entry = {};
            var fileFields = uf.get(j);
            fileFields.forEach(function(field, index) {
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
            if (entry) {
                entry.line = uf.getLine(j);
                result.push(entry);
            }
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

    for (var filename in files) {
        var contents = files[filename];
        var property = path.basename(filename, ".json");
        var fields = contents[property];
        for (var i = 0; i < fields.length; i++) {
            var entry = fields[i];
            entry.line = undefined;
        }
    }

    // flatten these
    var fields = files["json/BidiMirroring.json"].BidiMirroring;
    var merged = {};
    for (var i = 0; i < fields.length; i++) {
        var entry = fields[i];
        merged[entry.codepoint] = entry.mirror;
    }
    files["json/BidiMirroring.json"].BidiMirroring = merged;

    var fields = files["json/Jamo.json"].Jamo;
    var merged = {};
    for (var i = 0; i < fields.length; i++) {
        var entry = fields[i];
        merged[entry.codepoint] = entry.jamoShortName;
    }
    files["json/Jamo.json"].Jamo = merged;
}

var hexdigits = {
    '0': true, '1': true, '2': true, '3': true,
    '4': true, '5': true, '6': true, '7': true,
    '8': true, '9': true, 'A': true, 'B': true,
    'C': true, 'D': true, 'E': true, 'F': true,
    'a': true, 'b': true,
    'c': true, 'd': true, 'e': true, 'f': true
};

function isHexDigit(ch) {
    return ch && ch.length && hexdigits[ch[0]];
}

var fieldMap = {
    '=': 'aliases',
    'x': 'crossReferences',
    '*': 'comments',
    '#': 'compatibilityMappings',
    ':': 'decompositions',
    '~': 'variations'
};

function postProcessTabFiles(files) {
    var fields = files["json/Index.json"].Index;
    var merged = {};
    for (var i = 0; i < fields.length; i++) {
        var entry = fields[i];
        merged[entry.description] = entry.codepoint;
    }
    files["json/Index.json"].Index = merged;

    fields = files["json/NamesList.json"].NamesList;
    var results = [];
    merged = undefined;
    for (var i = 0; i < fields.length; i++) {
        var entry = fields[i];
        if (entry.codepoint && entry.codepoint.startsWith("@")) {
            if (merged) {
                results.push(merged);
                merged = undefined;
            }
            results.push({
                line: entry.line
            });
        } else {
            if (entry.codepoint) {
                if (merged) {
                    results.push(merged);
                }
                merged = {
                    codepoint: entry.codepoint,
                    name: entry.property
                };
            } else if (entry.property) {
                if (!merged) {
                    results.push({
                        line: entry.line
                    });
                } else {
                    var property = fieldMap[entry.property[0]] || 'other';
                    var value = entry.property.substring(2);
                    if (property === "decompositions" || property === "compatibilityMappings") {
                        var tmp = value.split(/\s+/g);
                        var values = [];
                        for (var j = 0; j < tmp.length; j++) {
                            if (isHexDigit(tmp[j]) || tmp[j][0] === '<') {
                                values.push(tmp[j]);
                            } else {
                                values.push(tmp.slice(j).join(' '));
                                break;
                            }
                        }
                        value = values;
                    }
                    if (!merged[property]) {
                        merged[property] = [];
                    }
                    merged[property].push(value);
                }
            }
        }
    }
    if (merged) {
        results.push(merged);
    }

    files["json/NamesList.json"].NamesList = results;
}

function postProcessNormalized(files) {
    for (var filename in files) {
        var contents = files[filename];
        var property = path.basename(filename, ".json");
        var fields = contents[property];
        var merged = {};
        for (var i = 0; i < fields.length; i++) {
            var entry = fields[i];
            if (!merged[entry.codepoint]) {
                merged[entry.codepoint] = {
                    codepoint: entry.codepoint
                };
            }
            merged[entry.codepoint][entry.field] = entry.value;
        }
        var tmp = {};
        tmp[property] = [];
        // now that they are merged, convert them to an array again
        for (var name in merged) {
            tmp[property].push(merged[name]);
        }
        files[filename] = tmp;
    }
}

var contents = {};
processFiles(UCDFiles.semicolon, contents, {
    splitChar: ';'
});
postProcessSemiFiles(contents);
writeFiles(contents);

contents = {};
processFiles(UCDFiles.tab, contents, {
    splitChar: "\t",
    commentString: "@",
    multilineComments: true
});
postProcessTabFiles(contents);
writeFiles(contents);

contents = {};
processFiles(UCDFiles.normalized, contents, {
    splitChar: "\t"
});
postProcessNormalized(contents);
writeFiles(contents);

console.log("Done.");
