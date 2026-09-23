// file: src/app.js
const { register, stopAll } = require("./cronManager");

register("health-check", "*/5 * * * *", async () => {
  console.log("Health check OK");
});
register("daily-backup", "0 2 * * *", async () => {
  console.log("Running daily backup");
});

// Graceful shutdown: stop cron jobs before the process exits
process.on("SIGTERM", () => {
  console.log("SIGTERM received, stopping cron jobs...");
  stopAll();
  process.exit(0);
});
