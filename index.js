require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const sequelize = require("./sequelize");

// Swagger doc
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Console Logging
const chalk = require("chalk");
const error = chalk.bold.red;
const success = chalk.bold.green;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(require("express-status-monitor")());

// Routes
app.use("/users", require("./routes/users.route.js"));

async function main() {
  await sequelize.sync();
  try {
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
