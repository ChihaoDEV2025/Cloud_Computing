// //hash password function
// const hashPassword = (password) => {
//   return `hashed_${password}$_${Date.now()}$`;
// };

// module.exports = { hashPassword };

//Crypto
const crypto = require("crypto");
const hashPassword = (pass) => {
  return crypto.createHash("sha256").update(pass).digest("hex");
};
module.exports = { hashPassword };
