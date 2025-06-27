const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { NotFoundError } = require("../utils/NotFoundError");
const { BadRequestError } = require("../utils/BadRequestError");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Requested user not found");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
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
    .catch(next);
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
    .catch(next);
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
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
