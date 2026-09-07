// Script tạo file cấu hình sshd bảo mật
function generateSecureSSHDConfig() {
  const config = `
# Cấu hình bảo mật SSH Server
Port 22
Protocol 2

# Xác thực
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no

# Giới hạn người dùng
AllowUsers ubuntu deploy
DenyUsers root admin

# Giới hạn đăng nhập
MaxAuthTries 3
MaxSessions 10
LoginGraceTime 60

# Cài đặt bảo mật
UsePAM yes
X11Forwarding no
PrintMotd no
TCPKeepAlive yes
ClientAliveInterval 300
ClientAliveCountMax 2

# Logging
SyslogFacility AUTH
LogLevel VERBOSE

# Chống brute-force
UseDNS no
`;

  return config;
}

// Kiểm tra cấu hình bảo mật
function checkSSHSecurity(sshConfig) {
  const securityChecks = {
    usesStrongCrypto: sshConfig.includes("Ciphers aes256-ctr"),
    passwordDisabled: sshConfig.includes("PasswordAuthentication no"),
    rootLoginDisabled: sshConfig.includes("PermitRootLogin no"),
    hasMaxAuthTries: sshConfig.includes("MaxAuthTries"),
    usesProtocol2: sshConfig.includes("Protocol 2"),
  };

  const score = Object.values(securityChecks).filter(Boolean).length;
  const total = Object.keys(securityChecks).length;

  console.log(`Security Score: ${score}/${total}`);
  console.log("Recommendations:");

  if (!securityChecks.usesStrongCrypto) {
    console.log("- Enable strong encryption: Ciphers aes256-ctr");
  }
  if (!securityChecks.passwordDisabled) {
    console.log("- Disable password authentication");
  }

  return securityChecks;
}

// Sử dụng các hàm bảo mật
const secureConfig = generateSecureSSHDConfig();
console.log("Generated secure SSH config:");
console.log(secureConfig);

const securityReport = checkSSHSecurity(secureConfig);
