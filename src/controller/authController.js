const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const cloudinary = require("cloudinary").v2;
const sendPasswordResetEmail = require("../utils/nodeMail");
// const { verifyResetPasswordToken } = require("../model/userSchema");
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const sample = async (req, res, next) => {
  return next(new AppError(400, "error done"));
};

const singUp = async (req, res, next) => {
  const { email, number, password } = req.body;
  if (!email || !number || !password) {
    return res.status(400).json({
      status: false,
      message: "Enter all the feild000000000",
    });
  }

  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      status: false,
      message: "enter the valid email",
    });
  }
  try {
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      return next(new AppError(400, "email already exist"));
    }

    const user = userModel({
      number: number,
      email: email,
      password: password,
    });
    await user.save();
    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        data: "this email is already exist",
      });
    }
    console.log(`Some error in the signing process ${err}`);
    return res.status(400).json({
      status: false,
      error: err,
    });
  }
};
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError(400, "fill all  the entery "));
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        message: "invalid credentail",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOption);
    res.status(200).json({
      message: "login success ",
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

const resetPasswordlink = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError(400, " Email required"));
  }
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(new AppError(400, "This email will not exist"));
    }
    const resetToken = await user.generateResetPasswordToken();

    const tokenUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await user.save();
    sendPasswordResetEmail(email, tokenUrl);
    res.status(200).json({
      success: true,
      data: user,
      token: tokenUrl,
      resetToken: resetToken,
    });
  } catch (err) {
    // user.forgetToken = undefined;
    // user.forgetTokenDate = undefined;
    return next(new AppError(400, err.message));
  }
};
const resetPassword = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError(400, "Unauthorized"));
  }
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return next(new AppError(400, "fill all the entry"));
  }

  if (newPassword != confirmPassword) {
    return next(new AppError(400, "Password will not match"));
  }

  try {
    const user = await userModel
      .findOne({ email: email })
      .select("+forgetToken +forgetTokenDate");

    if (!user) {
      return next(new AppError(400, "user with this email not exist"));
    }
    const isTokenValid = user.verifyResetPasswordToken(id);

    if (!isTokenValid) {
      return next(
        new AppError(400, "Unable to reset password: Invalid or expired token")
      );
    }
    user.password = newPassword;
    user.forgetToken = undefined;
    user.forgetTokenDate = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "successfull reset the password",
    });
  } catch (err) {
    res.status(400).json({
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
  resetPasswordlink,
  resetPassword,
};
