require("dotenv").config();
require("express-async-errors");

//Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

// Db Connection
const connect = require("./db/connect");

// Routers
const authRouter = require("./routers/auth");
const jobsRouter = require("./routers/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windoMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

//not found middleware
app.use(notFoundMiddleware);

//error handler middleware
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    console.log("Connecting to database.....");
    await connect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
