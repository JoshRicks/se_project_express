const BAD_DATA_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const DUPLICATE_ERROR = 409;
const AUTHORIZATION_ERROR = 401;
const PERMISSION_ERROR = 403;

const errorCatcher = (err, res) => {
  console.error(err);
  if (err.name === "MongooseServerSelectionError") {
    return res
      .status(SERVER_ERROR)
      .send({ message: "Database connection error" });
  }
  if (err.name === "CastError") {
    return res.status(BAD_DATA_REQUEST).send({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(BAD_DATA_REQUEST).send({ message: err.message });
  }
  if (err.code === 11000) {
    return res
      .status(DUPLICATE_ERROR)
      .send({ message: "Email already exists in database" });
  }
  if (err.name === "AuthorizationError") {
    return res.status(AUTHORIZATION_ERROR).send({ message: err.message });
  }
  return res
    .status(SERVER_ERROR)
    .send({ message: "An error occurred on the server" });
};

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 401;
  }
}

module.exports = {
  BAD_DATA_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  AUTHORIZATION_ERROR,
  errorCatcher,
  PERMISSION_ERROR,
  AuthorizationError,
};
