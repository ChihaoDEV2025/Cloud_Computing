// Ví dụ về xử lý bảo mật trong code
const crypto = require("crypto");

class SecureSSHManager {
  constructor() {
    this.encryptedKeys = new Map();
  }

  encryptPrivateKey(privateKey, password) {
    const cipher = crypto.createCipher("aes-256-gcm", password);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
      encryptedKey: encrypted,
      authTag: cipher.getAuthTag().toString("hex"),
      iv: cipher.iv.toString("hex"),
    };
  }

  // Thêm các phương thức bảo mật khác...
}
