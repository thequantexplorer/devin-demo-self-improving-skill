---
name: acme-reports-dev
description: How to set up, run, and test the acme-reports repo (Node finance reports rendered from schema.json). Use before running tests, adding a report, or editing schema.json / codegen.
---

# acme-reports: setup, run, test

Plain Node (CI uses Node 22). No dependencies, so there is no `npm install` step.
CI (`.github/workflows/ci.yml`) is the source of truth: it sets `TZ: America/Chicago`, runs `npm run codegen`, then `npm test`.

## Quirk 1: generated code must exist before anything runs

- `src/report.js` requires `src/generated/columns.js`, which is **generated** from `schema.json` by `scripts/codegen.js`.
- `src/generated/` is gitignored, so a fresh clone does not have it. Symptom: `Cannot find module './generated/columns'` from `npm test` or `npm run report`.
- Fix: `npm run codegen`. Re-run it **every time you edit `schema.json`**; a stale file gives missing columns or `Unknown report "<name>"`.
- Never hand-edit or commit `src/generated/`.

## Quirk 2: tests only pass with TZ=America/Chicago

- Events in `src/data.js` are UTC, but `localDay` / `localWeek` in `src/report.js` bucket by the **process's local timezone** (finance closes on Chicago days).
- Devin VMs default to UTC. Under UTC, both the snapshot test and `buckets late-evening orders into the local day` fail (e.g. `actual: '2026-10-01'`, expected `'2026-09-30'`). This is the environment, not a code bug; do not "fix" the code or the snapshots to make UTC pass.
- Always run with `TZ=America/Chicago` (as CI does). Never regenerate snapshots without it.

## Commands (copy exactly)

```sh
npm run codegen                                         # after clone and after any schema.json edit
TZ=America/Chicago npm test                             # full suite (node --test)
TZ=America/Chicago npm run report                       # daily_revenue (default)
TZ=America/Chicago npm run report -- --report weekly_revenue
```

## Layout

- `schema.json` — `reports.<name>.columns` (`key`, `label`, `type`: `date` | `int` | `money`). One entry per report.
- `scripts/codegen.js` — writes `src/generated/columns.js` = `{ <report>: columns[] }` plus `SCHEMA_HASH`.
- `src/report.js` — row builders (`dailyRevenue`, `weeklyRevenue`, registered in `reports`) and `toMarkdown(rows, reportName)`. Money is integer cents, rendered `$X.YY`.
- `src/cli.js` — `--report <name>` / `--report=<name>`, defaults to `daily_revenue`; unknown names exit 1.
- `test/report.test.js` + `test/__snapshots__/<report>.md` — finance-approved snapshots compared with `strictEqual`.

## Adding a new report (checklist)

1. Add `reports.<name>.columns` to `schema.json`, then `npm run codegen`.
2. Add a row builder in `src/report.js` (reuse `revenueBy(events, keyName, keyFn)` for time buckets) and register it in `reports`. The CLI picks it up automatically.
3. Generate the snapshot **in Chicago time** and check the numbers by hand before committing:
   `TZ=America/Chicago node src/cli.js --report <name> > test/__snapshots__/<name>.md`
4. Add a snapshot test and a bucketing test to `test/report.test.js`.
5. `TZ=America/Chicago npm test` must be green.
