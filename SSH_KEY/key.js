// Sử dụng thư viện 'node-forge' để tạo SSH key
const forge = require("node-forge");

function generateSSHKeyPair(email) {
  // Tạo cặp khóa RSA
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 4096 });

  // Lấy khóa công khai ở định dạng OpenSSH
  const publicKey = forge.ssh.publicKeyToOpenSSH(keypair.publicKey, email);

  // Lấy khóa riêng tư ở định dạng PEM
  const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

  return {
    publicKey: publicKey,
    privateKey: privateKey,
    algorithm: "rsa",
    bits: 4096,
  };
}

// Sử dụng hàm để tạo key
const myKeyPair = generateSSHKeyPair("devops@example.com");
console.log("Public Key:", myKeyPair.publicKey.substring(0, 100) + "...");
console.log("Private Key length:", myKeyPair.privateKey.length);
