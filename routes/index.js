const router = require("express").Router();
const clothingRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  console.error();
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
