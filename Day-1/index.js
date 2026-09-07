//require
const AuthService = require("./auth");
const { hashPassword } = require("./security-fix");

//Definition
const auth = new AuthService();
const intro = "Hello, My name is Chi Hao, welcom to my project";
//1.function: Display

const display = () => {
  console.log(intro);
  console.log("Version: 1.0.0");
};

//2. Further Function: auth
const enhancedApp = () => {
  try {
    //
    const password = "123";
    const hashedPassword = hashPassword(password);

    //register

    auth.register("admin", hashedPassword);
    console.log(hashedPassword);

    //login
    const loginPassword = hashPassword(password);
    console.log(auth.login("admin", loginPassword));
  } catch (error) {
    console.log("Error: ", error.message);
  }
};

//invoked function
enhancedApp();
display();

module.exports = { intro, display };
