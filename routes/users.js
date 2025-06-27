const router = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateLogin,
  validateUser,
  validateProfileChanges,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUser, createUser);

router.use(auth);

router.get("/users/me", getCurrentUser);
router.patch("/users/me", validateProfileChanges, updateProfile);

module.exports = router;
