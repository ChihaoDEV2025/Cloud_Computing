// Script quản lý SSH agent và thêm keys
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");

class SSHAgentManager {
  constructor() {
    this.agentPid = null;
    this.agentSocket = null;
  }

  startAgent() {
    try {
      // Kiểm tra nếu agent đã chạy
      const output = execSync("ssh-agent -s").toString();
      const matches = output.match(
        /SSH_AUTH_SOCK=([^;]+).*SSH_AGENT_PID=(\d+)/s,
      );

      if (matches) {
        this.agentSocket = matches[1];
        this.agentPid = parseInt(matches[2]);

        // Thiết lập biến môi trường
        process.env.SSH_AUTH_SOCK = this.agentSocket;
        process.env.SSH_AGENT_PID = this.agentPid.toString();

        console.log(`SSH Agent started with PID: ${this.agentPid}`);
        return true;
      }
    } catch (error) {
      console.error("Failed to start SSH agent:", error.message);
      return false;
    }
  }

  addKey(keyPath) {
    if (!fs.existsSync(keyPath)) {
      console.error(`Key file not found: ${keyPath}`);
      return false;
    }

    try {
      execSync(`ssh-add ${keyPath}`, {
        env: { ...process.env, SSH_AUTH_SOCK: this.agentSocket },
      });
      console.log(`Added key: ${keyPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to add key ${keyPath}:`, error.message);
      return false;
    }
  }

  listKeys() {
    try {
      const output = execSync("ssh-add -l", {
        env: { ...process.env, SSH_AUTH_SOCK: this.agentSocket },
      }).toString();
      console.log("Keys in agent:");
      console.log(output);
      return output;
    } catch (error) {
      console.error("Failed to list keys:", error.message);
      return null;
    }
  }
}

// Sử dụng SSH Agent Manager
const agentManager = new SSHAgentManager();

if (agentManager.startAgent()) {
  // Thêm các keys vào agent
  const keys = [
    `${os.homedir()}/.ssh/id_rsa`,
    `${os.homedir()}/.ssh/id_ed25519`,
  ];

  keys.forEach((key) => {
    if (fs.existsSync(key)) {
      agentManager.addKey(key);
    }
  });

  // Liệt kê các keys đã thêm
  agentManager.listKeys();
}
