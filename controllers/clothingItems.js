const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");

const {
  BAD_DATA_REQUEST,
  NOT_FOUND,
  errorCatcher,
} = require("../utils/errors");

const getClothingItem = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      if (!items || items.length === 0) {
        return res
          .status(NOT_FOUND)
          .send({ message: "No clothing items found" });
      }
      return res.status(200).send(items);
    })
    .catch(errorCatcher);
};

const createClothingItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(BAD_DATA_REQUEST).json({ message: "Name is required" });
  }
  if (!req.body.weatherType || req.body.weatherType.trim() === "") {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Weather type is required" });
  }
  if (!req.body.imageUrl || req.body.imageUrl.trim() === "") {
    return res
      .status(BAD_DATA_REQUEST)
      .json({ message: "Image URL is required" });
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((clothingItems) => res.status(201).send({ data: clothingItems }))
    .catch(errorCatcher);
};

const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.itemId)
    .then((clothingItems) => {
      if (!clothingItems) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested clothing item not found" });
      }
      return res.status(200).send({ data: clothingItems });
    })
    .catch(errorCatcher);
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
  ClothingItem.findByIdAndUpdate(
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
    .catch(errorCatcher);
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
  ClothingItem.findByIdAndUpdate(
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
    .catch(errorCatcher);
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
