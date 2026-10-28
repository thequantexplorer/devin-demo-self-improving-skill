const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { dailyRevenue, weeklyRevenue, toMarkdown } = require('../src/report');
const events = require('../src/data');

test('daily revenue matches the finance-approved snapshot', () => {
  const snap = fs.readFileSync(path.join(__dirname, '__snapshots__', 'daily_revenue.md'), 'utf8');
  assert.strictEqual(toMarkdown(dailyRevenue(events)), snap);
});

test('buckets late-evening orders into the local day', () => {
  const rows = dailyRevenue(events);
  assert.strictEqual(rows[0].day, '2026-09-30');
});

test('weekly revenue matches the finance-approved snapshot', () => {
  const snap = fs.readFileSync(path.join(__dirname, '__snapshots__', 'weekly_revenue.md'), 'utf8');
  assert.strictEqual(toMarkdown(weeklyRevenue(events), 'weekly_revenue'), snap);
});

test('buckets events into the local Monday-start week', () => {
  const rows = weeklyRevenue(events);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].week, '2026-09-28');
});
