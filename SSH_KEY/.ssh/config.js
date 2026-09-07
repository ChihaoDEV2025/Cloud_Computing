// Tạo script JavaScript để tự động tạo file config
const fs = require("fs");
const path = require("path");

function createSSHConfig(servers) {
  const sshDir = path.join(process.env.HOME, ".ssh");

  // Đảm bảo thư mục .ssh tồn tại
  if (!fs.existsSync(sshDir)) {
    fs.mkdirSync(sshDir, { mode: 0o700 });
  }

  const configPath = path.join(sshDir, "config");
  let configContent = "";

  servers.forEach((server) => {
    configContent += `
Host ${server.alias}
    HostName ${server.hostname}
    User ${server.username}
    Port ${server.port || 22}
    IdentityFile ${server.identityFile}
    ${server.options || ""}
`;
  });

  fs.writeFileSync(configPath, configContent, { mode: 0o600 });
  console.log("SSH config file created successfully!");
}

// Cấu hình các server
const serverConfigs = [
  {
    alias: "production",
    hostname: "prod-server.example.com",
    username: "ubuntu",
    port: 22,
    identityFile: "~/.ssh/id_ed25519_prod",
  },
  {
    alias: "staging",
    hostname: "staging.example.com",
    username: "deploy",
    port: 2222,
    identityFile: "~/.ssh/id_rsa_staging",
    options: "ServerAliveInterval 60",
  },
];

createSSHConfig(serverConfigs);
