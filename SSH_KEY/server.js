const Client = require("ssh2").Client;

class SSHConnection {
  constructor(config) {
    this.conn = new Client();
    this.config = config;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.conn
        .on("ready", () => {
          console.log(`Connected to ${this.config.host}`);
          resolve(this.conn);
        })
        .on("error", (err) => {
          console.error("Connection error:", err);
          reject(err);
        })
        .connect(this.config);
    });
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let stdout = "";
        let stderr = "";

        stream
          .on("close", (code, signal) => {
            console.log(`Command exited with code ${code}`);
            resolve({
              code: code,
              stdout: stdout,
              stderr: stderr,
            });
          })
          .on("data", (data) => {
            stdout += data.toString();
          })
          .stderr.on("data", (data) => {
            stderr += data.toString();
          });
      });
    });
  }

  disconnect() {
    this.conn.end();
    console.log("Disconnected from server");
  }
}

// Sử dụng lớp SSHConnection
async function main() {
  const sshConfig = {
    host: "your-server.com",
    port: 22,
    username: "ubuntu",
    privateKey: require("fs").readFileSync("/path/to/private/key"),
  };

  const ssh = new SSHConnection(sshConfig);

  try {
    await ssh.connect();

    // Thực thi lệnh trên server
    const result = await ssh.executeCommand("ls -la");
    console.log("Directory listing:", result.stdout);

    // Thực thi lệnh khác
    const systemInfo = await ssh.executeCommand("uname -a");
    console.log("System info:", systemInfo.stdout);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    ssh.disconnect();
  }
}

// Chạy kết nối
main();
