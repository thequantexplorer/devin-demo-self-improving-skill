const columnsByReport = require('./generated/columns');

// Finance closes the books on Chicago business days, so events are bucketed by *local* calendar day.
function localDay(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Weeks start on Monday (ISO-8601); a week is keyed by the local date of its Monday.
function localWeek(iso) {
  const d = new Date(iso);
  const sinceMonday = (d.getDay() + 6) % 7;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - sinceMonday);
  return localDay(monday);
}

function revenueBy(events, keyName, keyFn) {
  const rows = new Map();
  for (const e of events) {
    const key = keyFn(e.at);
    const row = rows.get(key) || { [keyName]: key, orders: 0, grossCents: 0, refundCents: 0 };
    if (e.type === 'order') { row.orders += 1; row.grossCents += e.amountCents; }
    if (e.type === 'refund') row.refundCents += e.amountCents;
    rows.set(key, row);
  }
  return [...rows.values()].sort((a, b) => a[keyName].localeCompare(b[keyName]));
}

function dailyRevenue(events) {
  return revenueBy(events, 'day', localDay);
}

function weeklyRevenue(events) {
  return revenueBy(events, 'week', localWeek);
}

const reports = {
  daily_revenue: dailyRevenue,
  weekly_revenue: weeklyRevenue,
};

function fmt(col, v) {
  if (col.type === 'money') return '$' + (v / 100).toFixed(2);
  return String(v);
}

function toMarkdown(rows, report = 'daily_revenue') {
  const columns = columnsByReport[report];
  if (!columns) throw new Error(`Unknown report "${report}". Run \`npm run codegen\` after editing schema.json.`);
  const head = '| ' + columns.map((c) => c.label).join(' | ') + ' |';
  const sep = '| ' + columns.map(() => '---').join(' | ') + ' |';
  const body = rows.map((r) => '| ' + columns.map((c) => fmt(c, r[c.key])).join(' | ') + ' |');
  return [head, sep, ...body].join('\n') + '\n';
}

module.exports = { dailyRevenue, weeklyRevenue, reports, toMarkdown, localDay, localWeek };
