const BAD_DATA_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const errorCatcher = (err, res) => {
  console.error(err);
  if (err.name === "MongooseServerSelectionError") {
    return res
      .status(SERVER_ERROR)
      .send({ message: "Database connection error" });
  }
  if (err.name === "CastError") {
    return res
      .status(BAD_DATA_REQUEST)
      .send({ message: "Invalid query format" });
  }
  if (err.name === "ValidationError") {
    return res
      .status(BAD_DATA_REQUEST)
      .send({ message: "Invalid data in query" });
  }
  return res
    .status(SERVER_ERROR)
    .send({ message: "An error occurred on the server" });
};

module.exports = {
  BAD_DATA_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  errorCatcher,
};
