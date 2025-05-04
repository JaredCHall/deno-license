## [1.1.0] - 2025-05-04

- Refactor `installLicense()` into prompt-based CLI method `installWithPrompts()`
- Extract logic into new `LicenseRegistry` class with static `.normalizeKey()` method
- Add full test coverage for prompt flow and registry fetch behavior
- Support CLI-friendly usage with `--allow-write` only (no read/net/env required)
- Improve modularity and testability via injected dependencies
- Keep exports minimal and clear in `mod.ts`

## [1.0.3] - 2025-05-04

- Fix stale README example
- Improve publish workflow
- Test if JSR picks up JSDoc from imports
- Remove extraneous method

## [1.0.2] - 2025-05-04

- Added JSDoc comments to all exported symbols
- Removed showUsage() method
- Added default value for main prompt

## [1.0.1] - 2025-05-04

- Added GitHub Actions-based CI publish workflow
- Added symbol documentation for `installLicense()`
- Improved JSR metadata and compatibility flags
- Earned provenance badge via verified publish

## [1.0.0] – 2025-05-03

🎉 Initial release of `deno-license`!

- Add CLI utility for installing OSI-compliant LICENSE files
- Support BSD-3-Clause, MIT, GPL-3.0, AGPL-3.0, and Hippocratic License v2.1
- Includes zero-dependency programmatic API via `installLicense()`