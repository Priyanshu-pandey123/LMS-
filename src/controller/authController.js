const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

const sample = async (req, res) => {
  res.status(200).json({
    data: "set up the user controller",
    user: user,
    hello: "heloo",
  });
};

const singUp = async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;
  if (!email || !name || !password || !confirmPassword) {
    return res.status(400).json({
      status: false,
      message: "Enter all the feild",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: false,
      message: "Password and Confirm Password not same:",
    });
  }
  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      status: false,
      message: "enter the valid email",
    });
  }
  try {
    const user = userModel(req.body);
    await user.save();
    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        data: "this email is already exist",
      });

      res.status(400).json({
        status: false,
        message: err.message,
      });
    }
    console.log(`Some error in the signing process ${err}`);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      status: false,
      message: "enter the the feild",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(400).json({
        message: "invalid credentail",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;
    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res.cookie("token", token, cookieOption);
    res.status(200).json({
      message: "login success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const profile = async (req, res) => {
  const user = req.user;
  try {
    const userDetail = await userModel.findById(user.id);
    res.status(200).json({
      success: true,
      data: userDetail,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const logout = (req, res) => {
  const jwtOption = {
    httpOnly: true,
    maxAge: 0,
  };
  try {
    res.cookie("token", "", jwtOption);
    res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  sample,
  singUp,
  signin,
  profile,
  logout,
};
