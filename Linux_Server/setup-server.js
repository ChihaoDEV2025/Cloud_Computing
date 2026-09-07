// setup-server.js - Script tự động hóa cài đặt
const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class ServerSetup {
  constructor() {
    this.steps = [];
  }

  async runStep(description, command) {
    console.log(`\n📝 ${description}`);
    try {
      const result = execSync(command, { stdio: "inherit" });
      this.steps.push({ step: description, status: "Success!" });
      return true;
    } catch (error) {
      console.error(`❌ Lỗi: ${error.message}`);
      this.steps.push({ step: description, status: "failure!" });
      return false;
    }
  }

  async setupNodeJS() {
    return await this.runStep(
      "Install nodejs 18.x",
      "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs",
    );
  }

  async setupPM2() {
    return await this.runStep("Install PM2", "sudo npm install -g pm2");
  }

  async setupFirewall() {
    return await this.runStep(
      "UFW Firewall Configuration",
      "sudo ufw allow ssh && sudo ufw allow 3000 && sudo ufw --force enable",
    );
  }

  async createAppStructure() {
    console.log("\n Create the folders of Application");

    const directories = [
      "app",
      "app/logs",
      "app/public",
      "app/config",
      "scripts",
    ];

    directories.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Create Directories: ${dir}`);
      }
    });

    // Create Server.js (if it isn't available)
    if (!fs.existsSync("app/server.js")) {
      const serverCode = fs.readFileSync("server.js", "utf8");
      fs.writeFileSync("app/server.js", serverCode);
      console.log("Server.js is created");
    }

    this.steps.push({ step: "Create The Folder's Structure", status: "Done" });
    return true;
  }

  generateReport() {
    console.log("\nServer Configuration");
    console.log("=".repeat(50));
    this.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step.step}: ${step.status}`);
    });
    console.log("=".repeat(50));
  }
}

async function main() {
  const setup = new ServerSetup();

  console.log("🔧 Linux Server Setup Script");

  // Cập nhật hệ thống
  await setup.runStep("Update package list", "sudo apt update");

  // Cài đặt các thành phần
  await setup.setupNodeJS();
  await setup.setupPM2();
  await setup.setupFirewall();
  await setup.createAppStructure();

  // Hiển thị báo cáo
  setup.generateReport();

  console.log("\n🎉 Done!");
  console.log("\n👉 Continue ...");
  console.log("   1. cd app");
  console.log("   2. npm init -y");
  console.log("   3. pm2 start server.js");
  console.log("   4. pm2 startup");
  console.log("   5. pm2 save");

  rl.close();
}

// Chạy script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ServerSetup;
