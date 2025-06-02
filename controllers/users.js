const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_DATA_REQUEST,
  NOT_FOUND,
  errorCatcher,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => errorCatcher(err, res));
};

const getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Requested user not found" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => errorCatcher(err, res));
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
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
    .then((user) => res.status(201).send(user))
    .catch((err) => errorCatcher(err, res));
};
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => errorCatcher(err, res));
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
  login,
};
