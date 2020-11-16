# UCD-full
The full Unicode Character Database files encoded as json.

This project publishes the exact same set of data files as the Unicode Character Database files,
but parsed and encoded in a more convenient format for javascript developers to consume.

## To Install

In your `package.json`:

```
    devDependencies: {
        ...
        "ucd-full": "^10.0.0",
        ...
    }
```

The major and minor version of this package is the same as the version of UCD that it supports. The
3rd level version number may change, however, as bugs or inaccuracies are discovered and fixed in
this package. (ie. version 13.0.2 still encodes UCD 10.0.0, but has had 2 bug fixes.)

The UCD files are very large, so it is not recommended to use this data directly. Also, they are
not whitespace compressed to make it easier for development. Instead, put ucd-full in your
`devDependencies` and write some code to extract at build time the subset of data that your
application needs.

## To Use

To use the files, require them directly:

```
var scripts = require("ucd-full/Scripts.json");
var caseFolding = require("ucd-full/CaseFolding.json");
var graphemeBreakProperty = require("ucd-full/auxiliary/GraphemeBreakProperty.json");
```

The set of files and their relative directory structure as the same as the UCD files.

## Data Types

### Codepoints

Codepoints are given by their hexadecimal value as they are in the UCD files. They are not
processed into actual Unicode values. This means any json parser should be able to parse
the files easily.

### Ranges

In general, for any field in any file that involves a range of Unicode code points, it is
encoded as an array:

```
[ "042D" ],             // a single codepoint
[ "0620", "063F" ],     // a range of codepoints between and including U+0620 and U+063F
```

The range is encoded as a tuple with a start and end, and are inclusive of the start and
end characters.

### Lists or Sequences

For any field that is a sequence or a list, the data is also encoded as an array of
discrete codepoints. Example entry from NormalizationTest.json:

```
        {
            "sourceSequence": [
                "1E0C",
                "0307"
            ],
            "NFCSequence": [
                "1E0C",
                "0307"
            ],
            "NFDSequence": [
                "0044",
                "0323",
                "0307"
            ],
            "NFKCSequence": [
                "1E0C",
                "0307"
            ],
            "NFKDSequence": [
                "0044",
                "0323",
                "0307"
            ]
        },
```

### One Column Files

For data files that only have one column, they are encoded in json as a simple array of
values. Example snippet from the LineBreakTest.json file:

```
{
    "LineBreakTest": [
        "× 0023 × 0023 ÷",
        "× 0023 × 0020 ÷ 0023 ÷",
        "× 0023 × 0308 × 0023 ÷",
        "× 0023 × 0308 × 0020 ÷ 0023 ÷",
        "× 0023 ÷ 2014 ÷",
        ...
    }
}
```

### Two Column Files

For data files that only have two columns, especially when it is a mapping between two
values, they are encoded in json as a simple object, mapping one to the other. Example
snippet from BidiMirroring.json:

```
{
    "BidiMirroring": {
        "2039": "203A",
        "2045": "2046",
        "2046": "2045",
        "2208": "220B",
        "2209": "220C",
        "2215": "29F5",
        "2220": "29A3",
        "2221": "299B",
        ...
    }
}
```

### Multi-Column Files

For files with multiple fields, they are encoded as an array of objects with property
names and values. Typically every entry in these type of files have the same schema,
though some entries may miss one or more of the properties. Example from ArabicShaping.json:

```
{
    "ArabicShaping": [
        {
            "codepoint": "0600",
            "name": "ARABIC NUMBER SIGN",
            "type": "U",
            "joiningGroup": "No_Joining_Group"
        },
        {
            "codepoint": "0601",
            "name": "ARABIC SIGN SANAH",
            "type": "U",
            "joiningGroup": "No_Joining_Group"
        },
        ...
    }
}
```

For the Unihan_* files, the data in the .txt files are given as denormalized. That is, all
of the properties for a particular codepoint that are given on separate lines. In the
json encoding, we put them all together in a single object, making it much easier to
process. Typically the schema for entries in such files is variable. Example from
Unihan_Variants.json:

```
{
    "Unihan_Readings": [
        {
            "codepoint": "U+3400",
            "kCantonese": "jau1",
            "kDefinition": "(same as U+4E18 丘) hillock or mound",
            "kMandarin": "qiū"
        },
        {
            "codepoint": "U+3401",
            "kCantonese": "tim2",
            "kDefinition": "to lick; to taste, a mat, bamboo bark",
            "kHanyuPinyin": "10019.020:tiàn",
            "kMandarin": "tiàn"
        },
        {
            "codepoint": "U+3402",
            "kCantonese": "hei2",
            "kDefinition": "(J) non-standard form of U+559C 喜, to like, love, enjoy; a joyful thing"
        },
        {
            "codepoint": "U+3404",
            "kMandarin": "kuà"
        },
        ...
    }
}
```

## Schema

The schema for each file is typically given in the comments at the header of the file, though some
files have special html descriptions because they are a bit more complicated. (Like NamesList.txt for
example.)

These are all the files and their schema. For more information as to what the fields and their
values mean, click on the link to read the original Unicode source txt files:

| File | Fields |
| -------- | ---------- |
| [json/auxiliary/GraphemeBreakProperty.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/GraphemeBreakProperty.txt) | range, property |
| [json/auxiliary/GraphemeBreakTest.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/GraphemeBreakTest.txt) | one column |
| [json/auxiliary/LineBreakTest.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/LineBreakTest.txt) | one column |
| [json/auxiliary/SentenceBreakProperty.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/SentenceBreakProperty.txt) | range, property |
| [json/auxiliary/SentenceBreakTest.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/SentenceBreakTest.txt) | one column |
| [json/auxiliary/WordBreakProperty.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/WordBreakProperty.txt) | range, property |
| [json/auxiliary/WordBreakTest.json](https://www.unicode.org/Public/10.0.0/ucd/auxiliary/WordBreakTest.txt) | one column |
| [json/BidiBrackets.json](https://www.unicode.org/Public/10.0.0/ucd/BidiBrackets.txt) | codepoint, bracket, type |
| [json/BidiCharacterTest.json](https://www.unicode.org/Public/10.0.0/ucd/BidiCharacterTest.txt) | codePointSequence, direction, embeddingLEvel, resolvedLevelList, indexList |
| [json/BidiMirroring.json](https://www.unicode.org/Public/10.0.0/ucd/BidiMirroring.txt) | two column codepoint map |
| [json/BidiTest.json](https://www.unicode.org/Public/10.0.0/ucd/BidiTest.txt) | input, bitset, levels |
| [json/Blocks.json](https://www.unicode.org/Public/10.0.0/ucd/Blocks.txt) | range, block |
| [json/CaseFolding.json](https://www.unicode.org/Public/10.0.0/ucd/CaseFolding.txt) | codepoint, status, mapping |
| [json/CJKRadicals.json](https://www.unicode.org/Public/10.0.0/ucd/CJKRadicals.txt) | radical, character, unified |
| [json/CompositionExclusions.json](https://www.unicode.org/Public/10.0.0/ucd/CompositionExclusions.txt) | one column |
| [json/DerivedAge.json](https://www.unicode.org/Public/10.0.0/ucd/DerivedAge.txt) | range, unicodeVersion |
| [json/DerivedCoreProperties.json](https://www.unicode.org/Public/10.0.0/ucd/DerivedCoreProperties.txt) | range, property |
| [json/DerivedNormalizationProps.json](https://www.unicode.org/Public/10.0.0/ucd/DerivedNormalizationProps.txt) | range, property, normalized |
| [json/EastAsianWidth.json](https://www.unicode.org/Public/10.0.0/ucd/EastAsianWidth.txt) | range, width |
| [json/EmojiSources.json](https://www.unicode.org/Public/10.0.0/ucd/EmojiSources.txt) | codepointSequence, docomo, kddi, softbank |
| [json/extracted/DerivedBidiClass.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedBidiClass.txt) | range, class |
| [json/extracted/DerivedBinaryProperties.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedBinaryProperties.txt) | range, property |
| [json/extracted/DerivedCombiningClass.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedCombiningClass.txt) | range, combiningClass |
| [json/extracted/DerivedDecompositionType.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedDecompositionType.txt) | range, type |
| [json/extracted/DerivedEastAsianWidth.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedEastAsianWidth.txt) | range, width |
| [json/extracted/DerivedGeneralCategory.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedGeneralCategory.txt) | range, category |
| [json/extracted/DerivedJoiningGroup.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedJoiningGroup.txt) | range, group |
| [json/extracted/DerivedJoiningType.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedJoiningType.txt) | range, type  |
| [json/extracted/DerivedLineBreak.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedLineBreak.txt) | range, property |
| [json/extracted/DerivedName.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedName.txt) | range, name |
| [json/extracted/DerivedNumericType.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedNumericType.txt) | range, type |
| [json/extracted/DerivedNumericValues.json](https://www.unicode.org/Public/10.0.0/ucd/extracted/DerivedNumericValues.txt) | range, decimalValue, whole |
| [json/HangulSyllableType.json](https://www.unicode.org/Public/10.0.0/ucd/HangulSyllableType.txt) | range, hangulType |
| [json/Index.json](https://www.unicode.org/Public/10.0.0/ucd/Index.txt) | two column name map |
| [json/IndicPositionalCategory.json](https://www.unicode.org/Public/10.0.0/ucd/IndicPositionalCategory.txt) | range, positionalCategory |
| [json/IndicSyllabicCategory.json](https://www.unicode.org/Public/10.0.0/ucd/IndicSyllabicCategory.txt) | range, syllabicCategory |
| [json/Jamo.json](https://www.unicode.org/Public/10.0.0/ucd/Jamo.txt) | two column codepoint map |
| [json/LineBreak.json](https://www.unicode.org/Public/10.0.0/ucd/LineBreak.txt) | range, lineBreakProperty |
| [json/NameAliases.json](https://www.unicode.org/Public/10.0.0/ucd/NameAliases.txt) | codepoint, alias, type |
| [json/NamedSequences.json](https://www.unicode.org/Public/10.0.0/ucd/NamedSequences.txt) | name, codepointSequence |
| [json/NormalizationCorrections.json](https://www.unicode.org/Public/10.0.0/ucd/NormalizationCorrections.txt) | codepoint, original, corrected, unicodeVersion |
| [json/NormalizationTest.json](https://www.unicode.org/Public/10.0.0/ucd/NormalizationTest.txt) | sourceSequence, NFCSequence, NFDSequence, NFKCSequence, NFKDSequence |
| [json/NushuSources.json](https://www.unicode.org/Public/10.0.0/ucd/NushuSources.txt) | codepoint, kSrc_NushuDuben, kReading |
| [json/PropertyAliases.json](https://www.unicode.org/Public/10.0.0/ucd/PropertyAliases.txt) | shortName, longName |
| [json/PropertyValueAliases.json](https://www.unicode.org/Public/10.0.0/ucd/PropertyValueAliases.txt) | property, value1short, value1long, value2short, value2long |
| [json/PropList.json](https://www.unicode.org/Public/10.0.0/ucd/PropList.txt) | range, property |
| [json/ScriptExtensions.json](https://www.unicode.org/Public/10.0.0/ucd/ScriptExtensions.txt) | range, extension |
| [json/Scripts.json](https://www.unicode.org/Public/10.0.0/ucd/Scripts.txt) | range, script |
| [json/SpecialCasing.json](https://www.unicode.org/Public/10.0.0/ucd/SpecialCasing.txt) | codepoint, lowerSequence, titleSequence, upperSequence |
| [json/StandardizedVariants.json](https://www.unicode.org/Public/10.0.0/ucd/StandardizedVariants.txt) | variationSequence, description |
| [json/TangutSources.json](https://www.unicode.org/Public/10.0.0/ucd/TangutSources.txt) | codepoint, kTGT_MergedSrc, kRSTUnicode |
| [json/UnicodeData.json](https://www.unicode.org/Public/10.0.0/ucd/UnicodeData.txt) | codepoint, name, category, canonicalCombiningClass, bidirectionalCategory, mirrored, unicode1.0Name |
| [json/Unihan_DictionaryIndices.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_DictionaryIndices.txt) | codepoint, variety of other fields |
| [json/Unihan_DictionaryLikeData.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_DictionaryLikeData.txt) | codepoint, variety of other fields |
| [json/Unihan_IRGSources.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_IRGSources.txt) | codepoint, variety of other fields |
| [json/Unihan_NumericValues.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_NumericValues.txt) | codepoint, variety of other fields |
| [json/Unihan_OtherMappings.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_OtherMappings.txt) | codepoint, variety of other fields |
| [json/Unihan_RadicalStrokeCounts.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_RadicalStrokeCounts.txt) | codepoint, variety of other fields |
| [json/Unihan_Readings.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_Readings.txt) | codepoint, variety of other fields |
| [json/Unihan_Variants.json](https://www.unicode.org/Public/10.0.0/ucd/Unihan_Variants.txt) | codepoint, variety of other fields |
| [json/USourceData.json](https://www.unicode.org/Public/10.0.0/ucd/USourceData.txt) | sourceId, status, codepoint, radicalStrokeCount, dictionaryPosition, source |
| [json/VerticalOrientation.json](https://www.unicode.org/Public/10.0.0/ucd/VerticalOrientation.txt) | range, verticalOrientation |

### NamesList

The file NamesList.json is special because of its complicated schema. Multiple lines
in the NamesList file describe a single codepoint. There may be multiple values for the
aliases, for example, so aliases and most other properties are encoded as arrays of
strings that contain all of these multiple values. For compatibility mappings and
decompositions, each mapping or decomposition is further parsed into an array of codepoints
where possible.

Each entry in the names list is an object with the following properties:

```
{
    codepoint: "string",
    name: "string",
    aliases: "array of string",
    comments: "array of string",
    crossReferences: "array of string",
    compatibilityMappings: "array of array of string",
    decompositions: "array of array of string",
    variations: "array of string"
}
```

## License

This derivative work, ucd-full, is covered under the [Apache2 license](./LICENSE).

The Unicode data in this package is covered by the [Unicode Copyright and Terms of
Use](http://www.unicode.org/copyright.html) and by the [Unicode, Inc. License
Agreement - Data Files and Software](https://www.unicode.org/license.html). The
Unicode, Inc. License Agreement - Data Files and Software is as follows:

UNICODE, INC. LICENSE AGREEMENT - DATA FILES AND SOFTWARE

See Terms of Use for definitions of Unicode Inc.'s
Data Files and Software.

NOTICE TO USER: Carefully read the following legal agreement.
BY DOWNLOADING, INSTALLING, COPYING OR OTHERWISE USING UNICODE INC.'S
DATA FILES ("DATA FILES"), AND/OR SOFTWARE ("SOFTWARE"),
YOU UNEQUIVOCALLY ACCEPT, AND AGREE TO BE BOUND BY, ALL OF THE
TERMS AND CONDITIONS OF THIS AGREEMENT.
IF YOU DO NOT AGREE, DO NOT DOWNLOAD, INSTALL, COPY, DISTRIBUTE OR USE
THE DATA FILES OR SOFTWARE.

COPYRIGHT AND PERMISSION NOTICE

Copyright © 1991-2020 Unicode, Inc. All rights reserved.
Distributed under the Terms of Use in https://www.unicode.org/copyright.html.

Permission is hereby granted, free of charge, to any person obtaining
a copy of the Unicode data files and any associated documentation
(the "Data Files") or Unicode software and any associated documentation
(the "Software") to deal in the Data Files or Software
without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, and/or sell copies of
the Data Files or Software, and to permit persons to whom the Data Files
or Software are furnished to do so, provided that either

(a) this copyright and permission notice appear with all copies
of the Data Files or Software, or

(b) this copyright and permission notice appear in associated
Documentation.

THE DATA FILES AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT OF THIRD PARTY RIGHTS.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS
NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL
DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THE DATA FILES OR SOFTWARE.

Except as contained in this notice, the name of a copyright holder
shall not be used in advertising or otherwise to promote the sale,
use or other dealings in these Data Files or Software without prior
written authorization of the copyright holder.
