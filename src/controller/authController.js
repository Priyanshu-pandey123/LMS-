const userSchema = require("../model/userSchema");
const emailValidator = require("email-validator");

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
    const user = userSchema(req.body);
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
    const user = await userSchema.findOne({ email }).select("+password");
    if (!user || password !== user.password) {
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

const profile = (req, res) => {
  const user = req.user;
  res.send(user);
};
module.exports = {
  sample,
  singUp,
  signin,
  profile,
};
