# Public demo data handling

This repository is publicly readable, including its source code and commit history. Use it only for demonstration material suitable for unrestricted sharing.

## Reporting reference data

The report layouts in `reports/index.html` document reporting structure. All populated examples are created independently by a readable fixture generator in that file. The generator does not read an export, use source financial values as a seed, or transform actual donor records.

- People, organizations, funds, sponsors, amounts, counts, goals, fees, payout figures, activity patterns, and timestamps are fictional examples.
- Identifiers use explicit demonstration prefixes. Example email and URL fields use reserved example domains or explanatory placeholders.
- Individual gift reports that only need to explain a schema contain column headers without gift records.
- Years, report names, column names, and hourly labels describe the reporting layout; they do not authenticate any figures as NC State results.
- The reference page contains no production URLs, administrative access links, credentials, analytics, file import, or data submission code. It is self-contained and makes no external resource requests.

The supplied source archive and its original HTML were excluded from the public repository. Replacing a donor name while retaining their exact gift, fund, timestamp, or fundraiser totals would not have been sufficient for this demonstration.

## Other prototypes

The unit, performance, and challenge prototypes also use fictional fixtures. The unit report exports fictional records locally. The performance page can read a goals CSV in browser memory and loads Chart.js from a public CDN; it has no application data upload or persistence. Use sample data when trying these features.

## Before a future publication

Review the actual files that will be committed, including inline data, comments, URLs, exports, and any generated bundles. Verify that examples were created independently and that no private records or operational details remain in the source. Preserve clear demonstration labels in the interface and documentation.

The ignore rules reduce accidental additions of archives, spreadsheets, CSV exports, local data folders, and credential files. They are a convenience, not a privacy scanner or an access control. They do not remove files already committed, prevent a forced addition, or establish that an allowed file is safe.

This document records the public-demo approach. It is not institutional authorization to publish real data or a guarantee against every possible future disclosure.
