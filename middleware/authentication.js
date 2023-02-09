const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthenticatedError("authorization token not found");
  }

  const token = authorization.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throw new UnauthenticatedError("User Not Found");
    }
    req.user = { userId };
    next();
  } catch (err) {
    throw new UnauthenticatedError(err.message);
  }
};

module.exports = authMiddleware;
