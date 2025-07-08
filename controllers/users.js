const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { NotFoundError } = require("../utils/NotFoundError");
const { BadRequestError } = require("../utils/BadRequestError");
const { ConflictError } = require("../utils/ConflictError");
const { AuthorizationError } = require("../utils/AuthorizationError");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Requested user not found");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;
  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const createdUser = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(201).send(createdUser);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.code === 11000) {
        return next(
          new ConflictError({ message: "Email already exists in database" })
        );
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      return next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequestError("Email is required");
  } else if (!password) {
    throw new BadRequestError("Password is required");
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Requested user not found");
      }
      const updatedUser = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
