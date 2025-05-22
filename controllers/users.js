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
    .catch(errorCatcher);
};

const getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Requested user not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch(errorCatcher);
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
  User.create({ name, avatar })
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => res.status(201).send(user))
    .catch(errorCatcher);
};

module.exports = {
  getUsers,
  createUser,
  getUsersById,
};
