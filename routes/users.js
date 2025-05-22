const router = require("express").Router();
const { getUsers, createUser, getUsersById } = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUsersById);

router.post("/", createUser);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
