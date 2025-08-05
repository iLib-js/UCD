# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [16.0.1] - 2025-08-04

### Added
- **ScriptInfo.json**: New JSON file containing ISO 15924 script information
  - Converts `iso15924.txt` (ISO 15924 - Codes for the representation of names of scripts) to JSON format
  - Contains script codes, names, and metadata for all registered scripts
  - Fields include: `code`, `number`, `englishName`, `frenchName`, `pva`, `unicodeVersion`, `date`
  - Provides standardized script information for JavaScript/TypeScript applications

### Changed
- Updated build process to handle `iso15924.txt` as a semicolon-separated file
- Modified `fields.json` to include field mappings for the new script info file
- Updated `build.js` to rename output from `iso15924.json` to `ScriptInfo.json`
- Enhanced error handling in post-processing functions for better robustness

### Technical Details
- Added `iso15924.txt` to the semicolon-separated files section in `fields.json`
- Implemented special case handling in `build.js` to prevent unnecessary "line" properties in ScriptInfo.json
- Updated README.md to document the new ScriptInfo.json file and its schema

## [16.0.0] - 2024-01-XX

### Added
- Supporting for Unicode Character Database v16.0.0
- Complete set of UCD files converted to JSON format
- Support for all standard Unicode Character Database files
- No differences in any existing json file from v16.0.0 of this package.
  Only the ScriptInfo.json file was added.