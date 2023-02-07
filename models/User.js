const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

userSchema.pre("save", function () {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(this.password, salt, 1000, 64, "sha512")
    .toString("hex");
  const encryptedPassword =
    salt + process.env.HASHED_PASSWORD_SALT_MERGER_KEY_1 + hashedPassword;

  this.password = encryptedPassword;
});

userSchema.methods.createJWT = function() {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

userSchema.methods.comparePassword = function (password) {
  const pattern = new RegExp(
    process.env.HASHED_PASSWORD_SALT_MERGER_KEY_1,
    "g"
  );
  const passwordSeparator = this.password.replace(pattern, ".$&.");
  const salt = passwordSeparator.split(".")[0];
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  const encryptedPassword =
    salt + process.env.HASHED_PASSWORD_SALT_MERGER_KEY_1 + hashedPassword;

  return this.password === encryptedPassword;
};

module.exports = mongoose.model("User", userSchema);
