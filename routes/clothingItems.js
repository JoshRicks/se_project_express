const router = require("express").Router();
const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateItem, validateId } = require("../middlewares/validation");

router.get("/", getClothingItem);

router.use(auth);

router.post("/", validateItem, createClothingItem);

router.delete("/:itemId", validateId, deleteClothingItem);

router.put("/:itemId/likes", validateId, likeItem);

router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
