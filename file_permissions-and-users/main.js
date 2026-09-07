// harden-permissions.js - run once after deploy
const { execSync } = require("child_process");
const APP_DIR = "/var/www/myapp";

// Each command mirrors the manual steps above
const commands = [
  `chown -R deploy:webapp ${APP_DIR}`,
  `find ${APP_DIR} -type d -exec chmod 755 {} \\;`,
  `find ${APP_DIR} -type f -exec chmod 644 {} \\;`,
  `chmod 600 ${APP_DIR}/.env`,
];

for (const cmd of commands) {
  console.log(`[permissions] ${cmd}`); // log exactly what runs
  execSync(`sudo ${cmd}`, { stdio: "inherit" });
}
