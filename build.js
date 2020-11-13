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

var UnicodeFile = require("./unifile.js").UnicodeFile;

var UCDFiles = {
    "ArabicShaping.txt": [
        "codepoint",
        "name",
        "type",
        "joiningGroup"
    ],
    "BidiBrackets.txt": [
        "codepoint",
        "bracket",
        "type"
    ],
    "BidiCharacterTest.txt": [
        "codePointSequence",
        "direction",
        "embeddingLevel",
        "resolvedLevelList",
        "indexList"
    ],
    "BidiMirroring.txt": [
        "codepoint",
        "mirror"
    ],
    // "BidiTest.txt": [],
    "Blocks.txt": [
        "range",
        "block"
    ],
    "CaseFolding.txt": [
        "codepoint",
        "status",
        "mapping"
    ],
    "CJKRadicals.txt": [
        "radical",
        "character",
        "unified"
    ],
    "CompositionExclusions.txt": [
        "codepoints"
    ],
    "DerivedAge.txt": [
        "range",
        "unicodeVersion"
    ],
    "DerivedCoreProperties.txt": [
        "range",
        "property"
    ],
    "DerivedNormalizationProps.txt": [
        "range",
        "property",
        "normalized" 
    ],
    "EastAsianWidth.txt": [
        "range",
        "width"
    ],
    "EmojiSources.txt": [
        "codepointSequence",
        "docomo",
        "kddi",
        "softbank"
    ],
    "EquivalentUnifiedIdeograph.txt": [
        "codepoint",
        "unified"
    ],
    "HangulSyllableType.txt": [
        "range",
        "hangulType"
    ],
    // "Index.txt": [],
    "IndicPositionalCategory.txt": [
        "range",
        "positionalCategory"
    ],
    "IndicSyllabicCategory.txt": [
        "range",
        "syllabicCategory"
    ],
    "Jamo.txt": [
        "codepoint",
        "jamoShortName"
    ],
    "LineBreak.txt": [
        "range",
        "lineBreakProperty"
    ],
    "NameAliases.txt": [
        "codepoint",
        "alias",
        "type"
    ],
    "NamedSequencesProv.txt": [
        "name",
        "codePointSequence"
    ],
    "NamedSequences.txt": [
        "name",
        "codePointSequence"
    ],
    // "NamesList.txt": [],
    "NormalizationCorrections.txt": [
        "codepoint",
        "original",
        "corrected",
        "unicodeVersion"
    ],
    "NormalizationTest.txt": [
        "source",
        "NFC",
        "NFD",
        "NFKC",
        "NFKD"
    ],
    // "NushuSources.txt": [],
    /*
    "PropertyAliases.txt": [],
    "PropertyValueAliases.txt": [],
    "PropList.txt": [],
    "ScriptExtensions.txt": [],
    "Scripts.txt": [],
    "SpecialCasing.txt": [],
    "StandardizedVariants.txt": [],
    "TangutSources.txt": [],
    "UnicodeData.txt": [],
    "Unihan_DictionaryIndices.txt": [],
    "Unihan_DictionaryLikeData.txt": [],
    "Unihan_IRGSources.txt": [],
    "Unihan_NumericValues.txt": [],
    "Unihan_OtherMappings.txt": [],
    "Unihan_RadicalStrokeCounts.txt": [],
    "Unihan_Readings.txt": [],
    "Unihan_Variants.txt": [],
    "USourceData.txt": [],
    "VerticalOrientation.txt": []
    */
};

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

var UCDFileNames = Object.keys(UCDFiles);
for (var i = 0; i < UCDFileNames.length; i++) {
    var filename = UCDFileNames[i];
    var base = path.basename(filename, ".txt");
    var pathname = path.join("UCD", filename);
    var contents = {};
    contents[base] = [];
    var result = contents[base];

    var uf = new UnicodeFile({
        path: pathname
    });
    var fields = UCDFiles[filename];

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
    var outputFileName = path.join("json", base + ".json");
    fs.writeFileSync(outputFileName, JSON.stringify(contents, undefined, 4), "utf-8");
}