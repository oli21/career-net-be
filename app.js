require("dotenv").config();
require("express-async-errors");
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

app.use(express.json());
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
    console.log("Connecting to database.....")
    await connect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
