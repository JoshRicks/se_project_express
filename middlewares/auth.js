const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AUTHORIZATION_ERROR } = require("../utils/errors");

const handleAuthError = (res) => {
  res.status(AUTHORIZATION_ERROR).send({ message: "Authorization Error" });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
