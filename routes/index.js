const router = require("express").Router();
const clothingRouter = require("./clothingItems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/NotFoundError");

router.use("/items", clothingRouter);
router.use("/", userRouter);

router.use(() => {
  console.error();
  throw new NotFoundError("Requested resource not found");
});

module.exports = router;
