require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const chalk = require("chalk");

const v1 = require("./v1");
const v2 = require("./v2");

const PORT = process.env.PORT || 4000;

// Console Logging
const error = chalk.bold.red;
const success = chalk.bold.green;

app.use(cors());
app.use(helmet());
app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) =>
  res.json({
    message:
      "Hello ! You can find interfaces from this API. /api/v1 provides you a REST API, /api/v2 provides you a GraphQL API"
  })
);

// Routes
app.use("/api/v1", v1); // REST API
app.use("/api/v2", v2); // GRAPHQL API

async function main() {
  try {
    app.listen(PORT, err => {
      if (err) {
        throw new Error(error("Something bad happened ..."));
      }
      console.log(success(`Listening to ${PORT}.`));
    });
  } catch (err) {
    console.error(error("Unable to reach database: "), err);
  }
}

if (process.env.NODE_ENV !== "test") {
  main();
}

module.exports = app;
