# Devin demo: Self-improving skill

**What it shows:** The tests fail until you know two setup quirks. Devin works them out, adds the feature, and writes a repo skill so later sessions set up correctly.

**Needs:** GitHub only

More demos: [devin-advanced-demos](https://github.com/thequantexplorer/devin-advanced-demos)

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-self-improving-skill`. The links and prompt below assume that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Add a "weekly_revenue" report to https://github.com/<you>/devin-demo-self-improving-skill, mirroring daily_revenue (same column schema pipeline, snapshot test, CLI flag).

This repo has a couple of non-obvious quirks that trip up newcomers (generated code and how tests depend on the environment). When you hit them, don't just work around them: once you've solved it, write a repo skill at .agents/skills/acme-reports-dev/SKILL.md capturing exactly how to set up, run, and test this repo correctly, so the next session gets it right the first time. Open a PR with the feature, the green test run, and the skill.
```
