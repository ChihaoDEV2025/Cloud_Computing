// file: src/jobs/backupJob.js
const cron = require("node-cron");

let isRunning = false; // simple in-process lock

cron.schedule("*/2 * * * *", async () => {
  if (isRunning) {
    console.warn("Previous backup still running, skipping this tick.");
    return;
  }
  isRunning = true;
  try {
    console.log("Backup started");
    await runBackup(); // your async work here
    console.log("Backup finished");
  } catch (err) {
    // Never let an error crash the whole scheduler
    console.error("Backup failed:", err.message);
    // TODO: send alert to Slack/Telegram
  } finally {
    isRunning = false; // always release the lock
  }
});

async function runBackup() {
  // Simulate async work
  return new Promise((resolve) => setTimeout(resolve, 3000));
}
