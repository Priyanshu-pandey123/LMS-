const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [5, "name should grater then 5 character"],
      maxLength: [50, "name should not greater than 50 char"],
      lowercase: true,
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
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    forgetToken: {
      type: String,
    },
    forgetTokenDate: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
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

// userSchema.methods = {
//   jwtToken() {
//     return JWT.sign(
//       { id: this._id, email: this.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );
//   },
// };

// userSchema.methods = {
//   generateResetPasswordToken() {
//     console.log("token prince");
//     const token = crypto.randomBytes(32).toString("hex");
//     const hashToken = crypto.createHash("sha256").update(token).digest("hex");
//     this.forgetToken = hashToken;
//     this.forgetTokenDate = Date.now() + 15 * 60 * 1000;
//   },
// };

// userSchema.methods = {
//   verifyResetPasswordToken(providedToken) {
//     console.log(providedToken);
//     const hashToken = crypto
//       .createHash("sha256")
//       .update(providedToken)
//       .digest("hex");

//     // Check if the provided hashed token matches the stored hash and if it's not expired
//     if (hashToken === this.forgetToken && Date.now() < this.forgetTokenDate) {
//       return true; // Token is valid
//     } else {
//       return false; // Token is either invalid or expired
//     }
//   },
// };

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  },

  generateResetPasswordToken() {
    const token = crypto.randomBytes(32).toString("hex"); // Generate plain token
    const hashToken = crypto.createHash("sha256").update(token).digest("hex"); // Hash the token
    this.forgetToken = hashToken; // Store the hashed token
    this.forgetTokenDate = Date.now() + 15 * 60 * 1000; // Set expiration time
    console.log("Generated Token:", token); // Log the plain token (for debugging, remove in productio
    console.log("Stored Hashed Token:", hashToken); // Log the hashed token
    return token; // Return the plain token to the user
  },
  verifyResetPasswordToken(providedToken) {
    const hashToken = crypto
      .createHash("sha256")
      .update(providedToken)
      .digest("hex"); // Hash the provided token
    console.log("Provided Token:", providedToken); // Log the plain token for verification
    console.log("Hashed Provided Token:", hashToken); // Log the hashed version of the provided token
    console.log("Stored Hash Token:", this.forgetToken); // Log the stored hash token
    console.log("Token Expiration Date:", new Date(this.forgetTokenDate)); // Log the expiration date
    console.log("Current Date:", new Date()); // Log the current date

    // Compare the hashed provided token with the stored hash and check expiration
    return hashToken === this.forgetToken && Date.now() < this.forgetTokenDate;
  },
};

const userModel = mongoose.model("userPrince", userSchema);

module.exports = userModel;
