const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router
  .route("/")
  .post(authMiddleware, createJob)
  .get(authMiddleware, getAllJobs);
router
  .route("/:id")
  .get(authMiddleware, getJob)
  .patch(authMiddleware, updateJob)
  .delete(authMiddleware, deleteJob);

module.exports = router;
