const router = require("express").Router();
const clothingRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingRouter);
router.use("/users", userRouter);

module.exports = router;
