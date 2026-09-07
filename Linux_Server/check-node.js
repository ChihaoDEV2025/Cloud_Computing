const { exec } = require("child_process");

console.log("Check nodejs version");

exec("node --version", (e, stdout, stderr) => {
  if (e) {
    console.log("node js is uninstalled");
    console.log(
      "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -",
    );
  }

  console.log(`✅ Node.js is installed: ${stdout.trim()}`);

  exec("npm --version", (npmError, npmStdout, npmStderr) => {
    if (!npmError) {
      console.log(`📦 npm version: ${npmStdout.trim()}`);
    }
  });
});
