const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [5, "name should grater then 5 character"],
      maxLength: [50, "name should not greater than 50 char"],
    },
    email: {
      type: String,
      required: [true, "email should be required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password should be required"],
      minLength: [10, "password should not be less than 10 character"],
      maxLength: [50, "password should not  be greater than 50 character"],
      select: false, // not randon give the password
    },
    forgetToken: {
      type: String,
    },
    forgetTokenDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  },
};

const userModel = mongoose.model("userPrince", userSchema);

module.exports = userModel;
