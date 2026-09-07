#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

class DeploymentScript {
  constructor(environment = "staging") {
    this.environment = environment;
    this.deployLog = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    this.deployLog.push(logMessage);
    console.log(logMessage);
  }

  runCommand(command, description) {
    this.log(`▶️  ${description}`);
    try {
      const output = execSync(command, { stdio: "inherit" });
      this.log(`${description} Successfully`);
      return true;
    } catch (error) {
      this.log(` ${description} failure: ${error.message}`);
      return false;
    }
  }

  async deploy() {
    this.log(`Deploying to ${this.environment} ...`);

    // 1. Pull code mới nhất
    if (!this.runCommand("git pull origin main", "Pull code từ Git")) {
      return false;
    }

    // 2. Cài đặt dependencies
    if (!this.runCommand("npm ci --only=production", "Cài đặt dependencies")) {
      return false;
    }

    // 3. Chạy tests
    if (!this.runCommand("npm test", "Chạy unit tests")) {
      return false;
    }

    // 4. Build ứng dụng
    if (!this.runCommand("npm run build", "Build ứng dụng")) {
      return false;
    }

    // 5. Khởi động lại service
    if (!this.runCommand("pm2 restart all", "Khởi động lại ứng dụng")) {
      return false;
    }

    // 6. Ghi log deploy
    this.saveDeployLog();

    this.log(`--Finish--`);
    return true;
  }

  saveDeployLog() {
    const logFile = `deploy-${this.environment}-${Date.now()}.log`;
    fs.writeFileSync(logFile, this.deployLog.join("\n"));
    this.log(`Đã lưu log deploy vào: ${logFile}`);
  }
}

const environment = process.argv[2] || "staging";
const deployer = new DeploymentScript(environment);

deployer.deploy().then((success) => {
  process.exit(success ? 0 : 1);
});
