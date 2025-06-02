const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUsersById,
  login,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

module.exports = router;
