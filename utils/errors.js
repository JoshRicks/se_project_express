const { ConflictError } = require("./ConflictError");
const { NotFoundError } = require("./NotFoundError");
const { AuthorizationError } = require("./AuthorizationError");
const { ForbiddenError } = require("./ForbiddenError");
const { BadRequestError } = require("./BadRequestError");
const { ServerError } = require("./ServerError");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "MongooseServerSelectionError") {
    const error = new ServerError(err.message);
    return res
      .status(error.statusCode)
      .send({ message: "Database connection error" });
  }
  if (err.name === "CastError") {
    const error = new BadRequestError(err.message);
    return res.status(error.statusCode).send({ message: error.message });
  }
  if (err.name === "ValidationError") {
    const error = new BadRequestError(err.message);
    return res.status(error.statusCode).send({ message: error.message });
  }
  if (err.name === "BadRequestError") {
    const error = new BadRequestError(err.message);
    return res.status(error.statusCode).send({ message: error.message });
  }
  if (err.name === "NotFoundError") {
    const error = new NotFoundError(err.message);
    return res.status(error.statusCode).send({ message: error.message });
  }
  if (err.code === 11000) {
    const error = new ConflictError(err.message);
    return res
      .status(error.statusCode)
      .json({ message: "Email already exists in database" });
  }
  if (err.name === "AuthorizationError") {
    const error = new AuthorizationError(err.message);
    return res.status(error.statusCode).json({ message: "Unauthorized" });
  }
  if (err.name === "ForbiddenError") {
    const error = new ForbiddenError(err.message);
    return res.status(error.statusCode).json({ message: "Forbidden" });
  }
  const error = new ServerError(err.message);
  return res
    .status(error.statusCode)
    .send({ message: "An error occurred on the server" });
};

module.exports = {
  errorHandler,
};
