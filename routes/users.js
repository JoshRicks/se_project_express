const router = require("express").Router();
const user = require("../models/user");

router.get("/users", (req, res) => {
  user
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Error" }));
});

router.get("/users/:userId", (req, res) => {
  user
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Requested resource not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(500).send({ message: "Error" }));
});

router.post("/users", (req, res) => {
  const { name, avatar } = req.body;

  user
    .create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: "Error" }));
});

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
