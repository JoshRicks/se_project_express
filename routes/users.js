const router = require("express").Router();
const { getUsers, createUser, getUsersById } = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUsersById);

router.post("/", createUser);

module.exports = router;
