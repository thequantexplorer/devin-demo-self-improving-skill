const columns = require('./generated/columns');

// Finance closes the books on Chicago business days, so events are bucketed by *local* calendar day.
function localDay(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dailyRevenue(events) {
  const rows = new Map();
  for (const e of events) {
    const day = localDay(e.at);
    const row = rows.get(day) || { day, orders: 0, grossCents: 0, refundCents: 0 };
    if (e.type === 'order') { row.orders += 1; row.grossCents += e.amountCents; }
    if (e.type === 'refund') row.refundCents += e.amountCents;
    rows.set(day, row);
  }
  return [...rows.values()].sort((a, b) => a.day.localeCompare(b.day));
}

function fmt(col, v) {
  if (col.type === 'money') return '$' + (v / 100).toFixed(2);
  return String(v);
}

function toMarkdown(rows) {
  const head = '| ' + columns.map((c) => c.label).join(' | ') + ' |';
  const sep = '| ' + columns.map(() => '---').join(' | ') + ' |';
  const body = rows.map((r) => '| ' + columns.map((c) => fmt(c, r[c.key])).join(' | ') + ' |');
  return [head, sep, ...body].join('\n') + '\n';
}

module.exports = { dailyRevenue, toMarkdown, localDay };
