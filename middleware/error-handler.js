const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(
      err.keyValue
    )} field, Please provide another value`;
  }

  if (err.name === "ValidationError") {
    customError.msg = `${Object.keys(err.errors).join(",")} are required`;
    customError.statusCode = 400
  }

  if(err.name === "CastError"){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }

  // return res.status(customError.statusCode).json(err);
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
