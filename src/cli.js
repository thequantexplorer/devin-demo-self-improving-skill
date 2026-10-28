// Usage: node src/cli.js [--report <name>]   (default: daily_revenue)
const { reports, toMarkdown } = require('./report');

const args = process.argv.slice(2);
let report = 'daily_revenue';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--report') report = args[++i];
  else if (args[i].startsWith('--report=')) report = args[i].slice('--report='.length);
}

const build = reports[report];
if (!build) {
  process.stderr.write(`Unknown report "${report}". Available: ${Object.keys(reports).join(', ')}\n`);
  process.exit(1);
}
process.stdout.write(toMarkdown(build(require('./data')), report));
