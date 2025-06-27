const router = require("express").Router();
const clothingRouter = require("./clothingItems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/NotFoundError");

router.use("/items", clothingRouter);
router.use("/", userRouter);

router.use((req, res, err) => {
  console.error();
  const error = new NotFoundError(err.message);
  res
    .status(error.statusCode)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
