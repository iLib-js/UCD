# UCD-full
All of the Unicode Character Database files encoded as json.

This project publishes the exact same set of data files as the Unicode Character Database files,
but parsed and encoded in a more convenient format for javascript developers to consume.

## To Install

In your `package.json`:

```
    devDependencies: {
        ...
        "UCD-full": "^13.0.0",
        ...
    }
```

The major and minor version of this package is the same as the version of UCD that it supports. The
3rd level version number may change, however, as bugs or inaccuracies are discovered and fixed. 
(ie. version 13.0.2 still encodes UCD 13.0.0, but has had 2 bug fixes.)

The UCD files are very large, so it is not recommended to use this data directly. Instead, put
UCD-full in your devDependencies and extract at build time only the subset of data you need.

## To Use

To use the files, require them directly:

```
var scripts = require("UCD/Scripts.json");
var caseFolding = require("UCD/CaseFolding.json");
var graphemeBreakProperty = require("UCD/auxiliary/GraphemeBreakProperty.json");
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

These are all the files and their schema:

| File | Fields |
| -------- | ---------- |
| json/ArabicShaping.json | codepoint, name, type, joiningGroup |
| json/auxiliary/GraphemeBreakProperty.json | range, property |
| json/auxiliary/GraphemeBreakTest.json | one column |
| json/auxiliary/LineBreakTest.json | one column |
| json/auxiliary/SentenceBreakProperty.json | range, property |
| json/auxiliary/SentenceBreakTest.json | one column |
| json/auxiliary/WordBreakProperty.json | range, property |
| json/auxiliary/WordBreakTest.json | one column |
| json/BidiBrackets.json | codepoint, bracket, type |
| json/BidiCharacterTest.json | codePointSequence, direction, embeddingLEvel, resolvedLevelList, indexList |
| json/BidiMirroring.json | two column codepoint map |
| json/BidiTest.json | input, bitset, levels |
| json/Blocks.json | range, block |
| json/CaseFolding.json | codepoint, status, mapping |
| json/CJKRadicals.json | radical, character, unified |
| json/CompositionExclusions.json | one column |
| json/DerivedAge.json | range, unicodeVersion |
| json/DerivedCoreProperties.json | range, property |
| json/DerivedNormalizationProps.json | range, property, normalized |
| json/EastAsianWidth.json | range, width |
| json/emoji | range, property |
| json/emoji/emoji-data.json | range, property |
| json/emoji/emoji-variation-sequences.json | variationSequence, style |
| json/EmojiSources.json | codepointSequence, docomo, kddi, softbank |
| json/EquivalentUnifiedIdeograph.json | range, unified |
| json/extracted/DerivedBidiClass.json | range, class |
| json/extracted/DerivedBinaryProperties.json | range, property |
| json/extracted/DerivedCombiningClass.json | range, combiningClass |
| json/extracted/DerivedDecompositionType.json | range, type |
| json/extracted/DerivedEastAsianWidth.json | range, width |
| json/extracted/DerivedGeneralCategory.json | range, category |
| json/extracted/DerivedJoiningGroup.json | range, group |
| json/extracted/DerivedJoiningType.json | range, type  |
| json/extracted/DerivedLineBreak.json | range, property |
| json/extracted/DerivedName.json | range, name |
| json/extracted/DerivedNumericType.json | range, type |
| json/extracted/DerivedNumericValues.json | range, decimalValue, whole |
| json/HangulSyllableType.json | range, hangulType |
| json/Index.json | two column name map |
| json/IndicPositionalCategory.json | range, positionalCategory |
| json/IndicSyllabicCategory.json | range, syllabicCategory |
| json/Jamo.json | two column codepoint map |
| json/LineBreak.json | range, lineBreakProperty |
| json/NameAliases.json | codepoint, alias, type |
| json/NamedSequences.json | name, codepointSequence |
| json/NamedSequencesProv.json | name, codepointSequence |
| json/NormalizationCorrections.json | codepoint, original, corrected, unicodeVersion |
| json/NormalizationTest.json | sourceSequence, NFCSequence, NFDSequence, NFKCSequence, NFKDSequence |
| json/NushuSources.json | codepoint, kSrc_NushuDuben, kReading |
| json/PropertyAliases.json | shortName, longName |
| json/PropertyValueAliases.json | property, value1short, value1long, value2short, value2long |
| json/PropList.json | range, property |
| json/ScriptExtensions.json | range, extension |
| json/Scripts.json | range, script |
| json/SpecialCasing.json | codepoint, lowerSequence, titleSequence, upperSequence |
| json/StandardizedVariants.json | variationSequence, description |
| json/TangutSources.json | codepoint, kTGT_MergedSrc, kRSTUnicode |
| json/UnicodeData.json | codepoint, name, category, canonicalCombiningClass, bidirectionalCategory, mirrored, unicode1.0Name |
| json/Unihan_DictionaryIndices.json | codepoint, variety of other fields |
| json/Unihan_DictionaryLikeData.json | codepoint, variety of other fields |
| json/Unihan_IRGSources.json | codepoint, variety of other fields |
| json/Unihan_NumericValues.json | codepoint, variety of other fields |
| json/Unihan_OtherMappings.json | codepoint, variety of other fields |
| json/Unihan_RadicalStrokeCounts.json | codepoint, variety of other fields |
| json/Unihan_Readings.json | codepoint, variety of other fields |
| json/Unihan_Variants.json | codepoint, variety of other fields |
| json/USourceData.json | sourceId, status, codepoint, radicalStrokeCount, dictionaryPosition, source |
| json/VerticalOrientation.json | range, verticalOrientation |

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
