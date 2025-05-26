const router = require("express").Router();
const clothingRouter = require("./clothingItems");
const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  console.error();
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
