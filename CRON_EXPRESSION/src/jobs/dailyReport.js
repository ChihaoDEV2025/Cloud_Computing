//# Install node-cron in your Node.js project
//npm install node-cron

// file: src/jobs/dailyReport.js
const cron = require("node-cron");

// '0 9 * * *' = every day at 09:00
cron.schedule(
  "0 9 * * *",
  () => {
    const now = new Date().toISOString();
    console.log(`[${now}] Generating daily report...`);
    // TODO: query DB, build report, send email
  },
  {
    timezone: "Asia/Ho_Chi_Minh", // run against Vietnam time, not the server's UTC
  },
);

console.log("Daily report job scheduled.");

//
