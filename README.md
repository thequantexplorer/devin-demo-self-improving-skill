# acme-reports

Finance reporting for Acme: daily revenue, refunds and MRR, rendered as Markdown/CSV for the month-end close.

```sh
npm run codegen                    # generates src/generated/ from schema.json (gitignored)
TZ=America/Chicago npm test
TZ=America/Chicago npm run report  # daily_revenue (default)
TZ=America/Chicago npm run report -- --report weekly_revenue
```

Columns for each report are defined in `schema.json`. See `.agents/skills/acme-reports-dev/SKILL.md` for setup details.

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
