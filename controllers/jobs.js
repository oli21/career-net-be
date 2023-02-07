const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const jobsModel = require("../models/Job");

const getAllJobs = async (req, res) => {
  console.log(req.user.userId);
  const jobs = await jobsModel.find({ createdBy: req.user.userId }).sort('createdAt');
  console.log(jobs);
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  res.send("get a job");
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
  res.send("update a job");
};

const deleteJob = async (req, res) => {
  res.send("delete a job");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
