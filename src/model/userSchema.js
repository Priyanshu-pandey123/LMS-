const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    number: {
      type: Number,
      required: [true, "Number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email should be required"],
      unique: true,
      lowercase: true,
      trim: true,
      // match:[ragex]
    },
    password: {
      type: String,
      required: [true, "password should be required"],
      maxLength: [50, "password should not  be greater than 50 character"],
      select: false, // not randon give the password
    },

    forgetToken: {
      type: String,
      select: false,
    },
    forgetTokenDate: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  },

  async generateResetPasswordToken() {
    const token = crypto.randomBytes(32).toString("hex");
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    this.forgetToken = hashToken;
    this.forgetTokenDate = Date.now() + 15 * 60 * 1000;
    await this.save();
    return token;
  },
  verifyResetPasswordToken(providedToken) {
    const hashToken = crypto
      .createHash("sha256")
      .update(providedToken)
      .digest("hex");
    console.log("Provided Token:", providedToken);
    console.log("Hashed Provided Token:", hashToken);
    console.log("Stored Hash Token:", this.forgetToken);
    console.log("Token Expiration Date:", new Date(this.forgetTokenDate));
    console.log("Current Date:", new Date());
    // Compare the hashed provided token with the stored hash and check expiration
    return hashToken === this.forgetToken && Date.now() < this.forgetTokenDate;
  },
};

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
