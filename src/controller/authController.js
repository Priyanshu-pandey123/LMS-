const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const cloudinary = require("cloudinary").v2;

const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const sample = async (req, res, next) => {
  return next(new AppError(400, "error done"));
};

const singUp = async (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body;
  console.log(req.body);
  console.log("File:", req.file.path);
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
    const userExist = await userModel.findOne({ email: email });
    if (userExist) {
      return next(new AppError(400, "email already exist"));
    }

    const user = userModel({
      name: name,
      email: email,
      password: password,
      avatar: {
        public_id: "prince",
        secure_url: "pandey",
      },
    });

    // todo image upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "lms",
          width: 300,
          height: 300,
          gravity: "face",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
        }
      } catch (err) {
        next(new AppError(500, err.message));
      }
    }
    await user.save();

    const token = user.jwtToken();
    res.cookie("token", token, cookieOption);

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        data: "this email is already exist",
      });

      return res.status(400).json({
        status: false,
        message: err.message,
      });
    }
    console.log(`Some error in the signing process ${err}`);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError(400, "fill all  the entery "));
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
    await user.save();

    const tokenUrl = `${process.env.FRONTEND_URL}/rest-password/${resetToken}`;
    console.log(tokenUrl);
    // send mail
    res.status(200).json({
      success: true,
      data: user,
      token: tokenUrl,
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
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return next(new AppError(400, "fill all the entry"));
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return next(new AppError(400, "user with this email not exist"));
    }
    const isTokenValid = user.verifyResetPasswordToken(id);
    console.log(isTokenValid, "token valid");

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
