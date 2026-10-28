const { dailyRevenue, toMarkdown } = require('./report');
process.stdout.write(toMarkdown(dailyRevenue(require('./data'))));
