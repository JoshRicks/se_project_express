const router = require("express").Router();
const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateItem, validateItemId } = require("../middlewares/validation");

router.get("/", getClothingItem);

router.use(auth);

router.post("/", validateItem, createClothingItem);

router.delete("/:itemId", validateItemId, deleteClothingItem);

router.put("/:itemId/likes", validateItemId, likeItem);

router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
