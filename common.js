/*
 * common.js - common routines shared amongst the cldr/unicode tools
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

/**
 * Return the character that is represented by the given hexadecimal encoding.
 * 
 * @param {string} hex the hexadecimal encoding of the code point of the character
 * @return {string} the character that is equivalent to the hexadecimal
 */
exports.hexToChar = function hexToChar(hex) {
    return exports.codePointToUTF16(parseInt(hex,16));
};

/**
 * Return a string created by interpretting the space-separated Unicode characters
 * encoded as hex digits. 
 * 
 * Example: "0065 0066"  -> "ab"
 * 
 * @param {string} hex the string of characters encoded as hex digits
 * @return {string} the equivalent string as regular UTF-16 Unicode characters
 */
exports.hexStringUTF16String = function (hex) {
    var chars = hex.split("\s+");
    var ret = "";

    for (var i = 0; i < chars.length; i++) {
        ret += exports.hexToChar(chars[i]);
    }

    return ret;
};

/**
 * Re-encode the characters in a string as a space-separated sequence of 16-bit
 * hex values.
 * 
 * @param {string} string string to re-encode 
 * @return {string} the re-encoded string
 */
exports.toHexString = function toHexString(string) {
    var i, result = "";

    if (!string) {
        return "";
    }
    for (i = 0; i < string.length; i++) {
        var ch = string.charCodeAt(i).toString(16);
        result += "0000".substring(0, 4-ch.length) + ch;
        if (i < string.length - 1) {
            result += " ";
        }
    }
    return result.toUpperCase();
};

