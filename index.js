require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const chalk = require("chalk");

const v1 = require("./v1");
const v2 = require("./v2");

const sequelize = require("./sequelize");

const PORT = process.env.PORT || 4000;

require("./sequelize/associations");

// Swagger doc

// Console Logging
const error = chalk.bold.red;
const success = chalk.bold.green;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(require("express-status-monitor")({ title: "WCS Cookie Clicker" }));

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
    await sequelize.sync();
    await sequelize.authenticate();
    console.log(success("Connection successful."));
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
