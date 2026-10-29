# NC State Day of Giving reporting demonstrations

Public prototypes for discussing Day of Giving reporting and challenge workflows. The demonstration records and performance figures are fictional. These pages are not connected to NC State, GiveCampus, GiveGab, or a donor database.

## Open the demonstrations

| Page | Purpose |
| --- | --- |
| [Unit gift reporting](https://agcompto.github.io/ncstate-dog-reporting-demo/) | Illustrative online and offline gift reports, filters, column selection, and CSV export. |
| [Performance dashboard](https://agcompto.github.io/ncstate-dog-reporting-demo/performance/) | A proposed performance monitoring experience with fictional historical comparisons. |
| [Challenge workflows](https://agcompto.github.io/ncstate-dog-reporting-demo/challenges.html) | Illustrative challenge administration and award workflows. |
| [Legacy reporting reference](https://agcompto.github.io/ncstate-dog-reporting-demo/reports/) | Existing report layouts and column definitions, populated with independently generated fictional examples. |

## Reporting reference

`reports/index.html` preserves the report structure for product discussion, including 65 table layouts and hourly comparison charts. Its sample figures, organizations, people, identifiers, dates, sponsor details, and URLs are generated for the demonstration. The original source records and archives are not included. Detailed individual gift reports show column definitions only.

The reporting reference is self-contained and loads no external scripts, fonts, analytics, or data. The separate performance prototype uses Chart.js from a public CDN. Its goals CSV picker reads a local file in browser memory; it does not send that file to a server or retain it after the page is reloaded.

## Public data handling

Read [PRIVACY.md](PRIVACY.md) before adding or replacing content. Do not commit donor exports, production reports, credentials, or internal administrative links. A hidden table, masked name, or JavaScript variable is still public when included in this repository.

## Hosting

These are static pages served by the repository's existing GitHub Pages deployment from `main`. No application server, credentials, API configuration, or build step is required.
