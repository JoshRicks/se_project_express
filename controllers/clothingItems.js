const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const { ForbiddenError } = require("../utils/ForbiddenError");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");

const getClothingItem = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItems) => res.status(201).send({ data: clothingItems }))
    .catch(next);
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError("Item ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError("invalid Item ID format");
  }

  return ClothingItem.findById(itemId)
    .then((clothingItem) => {
      if (!clothingItem) {
        throw new NotFoundError("Item not Found");
      }
      if (clothingItem.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.status(200).send({ data: deletedItem });
      });
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  if (!req.params.itemId) {
    throw new BadRequestError("Item ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    throw new BadRequestError("invalid Item ID format");
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItems) => {
      if (!clothingItems) {
        throw new NotFoundError("Requested clothing item not found");
      }
      return res.status(200).send({ data: clothingItems });
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  if (!req.params.itemId) {
    throw new BadRequestError("Item ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    throw new BadRequestError("invalid Item ID format");
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItems) => {
      if (!clothingItems) {
        throw new NotFoundError("Requested clothing item not found");
      }
      return res.status(200).send({ data: clothingItems });
    })
    .catch(next);
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
