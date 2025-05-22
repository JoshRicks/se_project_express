const User = require("../models/user");
const {
  BAD_DATA_REQUEST,
  NOT_FOUND,
  errorCatcher,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(NOT_FOUND).send({ message: "No users found" });
      }
      return res.status(200).send(users);
    })
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
  const { name, avatar } = req.body;
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(BAD_DATA_REQUEST).json({ message: "Name is required" });
  }
  if (!req.body.avatar || req.body.avatar.trim() === "") {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Avatar URL is required" });
  }
  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => errorCatcher(err, res));
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
};
