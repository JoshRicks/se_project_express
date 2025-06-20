const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  BAD_DATA_REQUEST,
  NOT_FOUND,
  errorCatcher,
  PERMISSION_ERROR,
} = require("../utils/errors");

const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => errorCatcher(err, res));
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItems) => res.status(201).send({ data: clothingItems }))
    .catch((err) => errorCatcher(err, res));
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  if (!itemId) {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Item ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Invalid item ID format" });
  }

  return ClothingItem.findById(itemId)
    .then((clothingItem) => {
      if (!clothingItem) {
        return res.status(NOT_FOUND).json({ message: "Item not Found" });
      }
      if (clothingItem.owner.toString() !== req.user._id) {
        return res
          .status(PERMISSION_ERROR)
          .json({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.status(200).send({ data: deletedItem });
      });
    })
    .catch((err) => errorCatcher(err, res));
};

const likeItem = (req, res) => {
  if (!req.params.itemId) {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Item ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Invalid item ID format" });
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItems) => {
      if (!clothingItems) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested clothing item not found" });
      }
      return res.status(200).send({ data: clothingItems });
    })
    .catch((err) => errorCatcher(err, res));
};

const dislikeItem = (req, res) => {
  if (!req.params.itemId) {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Item ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Invalid item ID format" });
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItems) => {
      if (!clothingItems) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested clothing item not found" });
      }
      return res.status(200).send({ data: clothingItems });
    })
    .catch((err) => errorCatcher(err, res));
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
