class AuthService {
  constructor() {
    this.user = new Map();
  }

  //DK
  register(user, pass) {
    //check if user already exists
    if (this.user.has(user)) {
      throw new Error();
    }

    //
    this.user.set(user, pass);
    return {
      success: true,
      message: "You signed up successfully",
    };
  }

  login(user, pass) {
    //get password
    const createdPassword = this.user.get(user);

    //compare pass to createdPassword
    if (pass === createdPassword) {
      return {
        success: true,
        message: "You signed in successfully",
      };
    }

    return {
      success: false,
      message: "Username or Password is incorrect!",
    };
  }

  validateLogin(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Email is invalid",
      };
    }

    if (password.length < 8) {
      return { success: false, message: "Password has at least 8 characters" };
    }

    return {
      success: true,
      message: "Your information is valid!",
    };
  }
}

module.exports = AuthService;
