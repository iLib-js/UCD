# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [16.0.2] - 2025-08-19

### Changed
- Added a dummy index.js that doesn't do anything. Some package managers will not
  install this package without a main.

## [16.0.1] - 2025-08-04

### Added
- **ScriptInfo.json**: New JSON file containing ISO 15924 script information
  - Converts `iso15924.txt` (ISO 15924 - Codes for the representation of names of scripts) to JSON format
  - Contains script codes, names, and metadata for all registered scripts
  - Provides standardized script information for JavaScript/TypeScript applications

### Changed
- Modified `fields.json` to include field mappings for the new script info file
- Enhanced error handling in post-processing functions for better robustness
- No differences in any existing json file from v16.0.0 of this package.
  Only the ScriptInfo.json file was added.

## [16.0.0] - 2024-01-XX

### Added
- Support for Unicode Character Database v16.0.0
- Complete set of UCD files converted to JSON format
- Support for all standard Unicode Character Database files
