# Day of Giving performance monitoring concept

This is a standalone GitHub Pages prototype. Open `performance/index.html` through the repository's Pages site. It uses `ledger.js` and `dashboard.js`; there are no external chart libraries, API keys, analytics tags, uploaded donor records or server dependencies.

## Privacy and status

Every gift, donor name, donor identifier and historical fundraising result is invented. The uploaded DoG26 Gift Tracker for Trends workbook was used to inspect functionality and calculation patterns only. Its actual fundraising values were not imported. Configuration changes are temporary and local to the page session. Numeric goal CSV files are parsed in the browser and never uploaded. This prototype is not a secure production donor-reporting service.

The public demo includes invented donor information. A production implementation must use authenticated, permission-controlled donor views, enforce recognition preferences server-side, and separate those views from an aggregate view-only sharing link. Disabling a copy button or hiding a column does not provide access control.

## Views

- Executive overview: gifts, dollars, current-period unique donors, gifts per donor, historical pace, goals and VIP/day reconciliation.
- Trends & forecasts: hourly and cumulative charts; exact hourly tables; explicit benchmark year; independently configurable gift and online-dollar baselines; three-hour moving averages; historical-pattern momentum; closing scenarios; dayparts; peak hours; milestone timing.
- Donor activity: gift-frequency distribution, repeat donors, recent gift activity, gift history, significant online gifts and online revenue concentration.
- Funds & Pack Leaders: unit and fund rollups, fund momentum, fund drilldowns, and advocate totals without an affiliation column.
- Campaign Operations: online leadership recognition, real timestamp-based 15/30/60-minute sample activity and read-only fund watchlists. No campaign actions or communications are executed.
- Configuration: scoped goals, thresholds, historical year sets, University Priorities, and staged, validated goal CSV import/export.

## Workbook functionality carried over

The source workbook's Gift Tracking sheet includes hourly totals, cumulative totals, pace against the historical average and 2025, projected final gifts, online mix, a three-hour moving average and historical-pattern momentum. Online Dollars provides parallel online-dollar analysis. GS Dashboard adds goal/run-rate analysis, a daypart summary, top five hours and four closing scenarios.

The prototype preserves those analytical concepts with these explicit refinements:

1. Gift Tracking AS/AQ/AR and Online Dollars Q/O/P: day-only activity drives pace; VIP is added once to campaign forecasts.
2. Gift Tracking AV/BB/BD and Online Dollars R/U: three-hour averages and actual-to-historical ratios use corresponding completed hours. Momentum labels are Surging at 1.30x or higher, Strong at 1.10x or higher, Below pattern below 0.90x, and Monitor otherwise. The workbook's Trigger Push becomes a read-only review signal.
3. Gift Tracking BA and Online Dollars T: the workbook's Smoothed Proj repeats the historical-pace calculation after the historical day share reaches 15%. This prototype calls it a readiness gate, not statistical smoothing. The gate is configurable.
4. Historical average year sets are separate because the source gift average excludes 2020 while its online-dollar average includes 2020. The demonstration adds invented 2026 history for a fictional 2027 event.
5. Closing scenarios: historical pace, observed day run rate, last three completed hours, and a 10% uplift applied only to remaining recent-rate activity. Historical-shape spread is not labeled a confidence interval.
6. Source daypart boundaries are retained; VIP is displayed separately instead of being mixed into overnight performance.
7. The current partial hour is labeled and excluded from hourly historical comparisons. Future current-day hours are blank, not zero.
8. Events/communications annotations are not implemented because communications monitoring was explicitly removed from scope.

## Counting and reconciliation

`ledger.js` deterministically generates a multi-year fixture. Every displayed actual is calculated from eligible records. Only completed transactions count; pending, failed and refunded records are excluded. Each record has one designation. A production multi-designation checkout needs an agreed allocation and gift-count definition; split designation rows must not automatically become multiple transactions.

Dollar arithmetic uses integer cents. Donor identity uses stable fictional IDs, not names. Unique donors are deduplicated across periods, units and advocates. Gift and dollar totals are additive; distinct donor counts are not. Advocate-attributed gifts are a subset of campaign activity.

Significant-gift recognition and donor gift-count recognition are strictly completed online gifts during the giving day, across all funds. They are independent of aggregate reporting filters and say so in the interface. A milestone entry is emitted once at its threshold and retains the supporting gift timestamp. Copying a leadership update is manual and never sends it.

## Deliberate exclusions and limitations

No first-time/returning donor segmentation, retention analysis, historical donor comparison, unique-donor forecasting, challenge administration/monitoring, communications timeline, donation health panel, gift processing or reconciliation workflow is included. Offline gifts can contribute to aggregate reporting but not online recognition; offline-dollar commitments are not extrapolated.

Historical fund comparisons require historical fund-level data in production. The university-wide hourly exports alone cannot provide those measures. This fictional fixture supplies them only to demonstrate the desired experience.

Configuration is not persisted or shared. No production authorization, historical import service or live fundraising connection is implemented.

## Verification performed

Before publication, the refined build was exercised in Chromium with desktop and 390-pixel mobile layouts. Checks covered tab navigation, donor/fund drilldowns, sort controls, recognition including the sample 50th gift, restricted-copy state, configuration application, invalid thresholds, staged CSV import, duplicate/unknown row rejection, start/partial/end-of-day cases, VIP/day/campaign periods, online/combined filters, and Command Central scrolling. No JavaScript errors occurred in those tests. This is functional testing, not an accessibility certification.

A Node model test completed 1,412 reconciliation assertions across times, periods, channels and scopes, with additional checks for unique milestone entries, completed-status eligibility, historical-baseline absence, forecast floors, end-of-day forecasts and hourly sums. See `verify-ledger.cjs` for the repeatable core checks.
