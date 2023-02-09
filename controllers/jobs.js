const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const jobsModel = require("../models/Job");

const getAllJobs = async (req, res) => {
  const jobs = await jobsModel
    .find({ createdBy: req.user.userId })
    .sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await jobsModel.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new BadRequestError(`No job found with this id ${jobId}`);
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  try {
    const createdJob = await jobsModel.create(req.body);
    res.status(StatusCodes.CREATED).json(createdJob);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company == "" || position == "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await jobsModel.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new BadRequestError(`No job found with this id ${jobId}`);
  }
  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await jobsModel.findOneAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new BadRequestError(`No job found with this id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({msg:"Job deleted successfully"});
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
