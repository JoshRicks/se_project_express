const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const { ForbiddenError } = require("../utils/ForbiddenError");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { AuthorizationError } = require("../utils/AuthorizationError");

const getClothingItem = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      return next(err);
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItems) => res.status(201).send({ data: clothingItems }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      return next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new NotFoundError("Item ID is required");
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
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "NotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      if (err.name === "ForbiddenError") {
        return next(new ForbiddenError("Forbidden"));
      }
      return next(err);
    });
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
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      if (err.name === "ForbiddenError") {
        return next(new ForbiddenError("Forbidden"));
      }
      return next(err);
    });
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
    .catch((err) => {
      console.error(err);
      if (err.name === "NotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "BadRequestError") {
        return next(new BadRequestError({ message: err.message }));
      }
      if (err.name === "AuthorizationError") {
        return next(new AuthorizationError("Unauthorized"));
      }
      if (err.name === "ForbiddenError") {
        return next(new ForbiddenError("Forbidden"));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
