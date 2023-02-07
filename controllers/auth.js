const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res) => {
  try {
    const user = await userModel.create({ ...req.body });
    res
      .status(StatusCodes.CREATED)
      .json({ user: user.name, token: user.createJWT() });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Email not found");
  }
  const isPasswordCorrect = user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong Credentials!!");
  }

  res.status(StatusCodes.OK).json({ user: user.name, token: user.createJWT() });
};

module.exports = {
  register,
  login,
};
