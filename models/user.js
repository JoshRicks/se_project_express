const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { AuthorizationError } = require("../utils/AuthorizationError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email",
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError("Incorrect password or email")
        );
      }
      if (email === undefined) {
        return Promise.reject(
          new AuthorizationError("Incorrect password or email")
        );
      }
      if (password === undefined) {
        return Promise.reject(
          new AuthorizationError("Incorrect password or email")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError("Incorrect password or email")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
