const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  try {
    const user = await userModel.create({ ...req.body });
    res
      .status(StatusCodes.CREATED)
      .json({ user: user.name, token: user.createJwt() });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
