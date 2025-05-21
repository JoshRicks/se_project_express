const router = require("express").Router();
const clothingItem = require("../models/clothingItem");

router.get("/items", (req, res) => {
  clothingItem
    .find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch(() => res.status(500).send({ message: "Error" }));
});

router.post("/items", (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch(() => res.status(500).send({ message: "Error" }));
});

router.delete("/items/:itemId", (req, res) => {
  clothingItem
    .findByIdAndRemove(req.params.itemId)
    .then((clothingItems) => {
      if (!clothingItems) {
        res.status(404).send({ message: "Requested resource not found" });
      } else {
        res.send({ data: clothingItems });
      }
    })
    .catch(() => res.status(500).send({ message: "Error" }));
});

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
