// file: src/cronManager.js
const cron = require("node-cron");

const jobs = new Map();

function register(name, schedule, handler) {
  // Validate expression before scheduling
  if (!cron.validate(schedule)) {
    throw new Error(`Invalid cron expression for "${name}": ${schedule}`);
  }
  const task = cron.schedule(
    schedule,
    async () => {
      try {
        await handler();
      } catch (err) {
        console.error(`[cron:${name}] failed:`, err.message);
      }
    },
    { timezone: "Asia/Ho_Chi_Minh" },
  );
  jobs.set(name, task);
  console.log(`Registered job "${name}" (${schedule})`);
}

function stopAll() {
  for (const [name, task] of jobs) {
    task.stop();
    console.log(`Stopped job "${name}"`);
  }
  jobs.clear();
}

module.exports = { register, stopAll };
