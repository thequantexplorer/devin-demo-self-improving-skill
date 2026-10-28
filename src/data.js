// Order events as stored in the warehouse (timestamps in UTC).
module.exports = [
  { id: 1, at: '2026-10-01T03:15:00Z', type: 'order', amountCents: 4900 },
  { id: 2, at: '2026-10-01T15:40:00Z', type: 'order', amountCents: 12900 },
  { id: 3, at: '2026-10-01T23:30:00Z', type: 'order', amountCents: 2500 },
  { id: 4, at: '2026-10-02T04:05:00Z', type: 'refund', amountCents: 2500 },
  { id: 5, at: '2026-10-02T18:20:00Z', type: 'order', amountCents: 8900 },
  { id: 6, at: '2026-10-03T02:00:00Z', type: 'order', amountCents: 19900 },
  { id: 7, at: '2026-10-03T16:45:00Z', type: 'refund', amountCents: 4900 },
];
