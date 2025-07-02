const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AuthorizationError } = require("../utils/AuthorizationError");

const handleAuthError = (res, err) => {
  const error = new AuthorizationError(err.message);
  return res.status(error.statusCode).json({ message: "Unauthorized" });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(
      res,
      new Error("Missing or invalid authorization header")
    );
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res, err);
  }

  req.user = payload;

  return next();
};
