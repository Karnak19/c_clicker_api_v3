const fs = require("fs");
const pathname = require("path");
const chalk = require("chalk");
const green = chalk.bold.green;
const red = chalk.bold.red;
const white = chalk.bold.white;

const awesomeLogger = (req, res, next) => {
  const now = Date.now();
  const humanNow = Date(now).toLocaleString();
  const method = req.method;
  const path = req.originalUrl;
  res.on("finish", function() {
    const code = this.statusCode;
    const time = Date.now() - now;
    let logMessage = `${method} ${path} ${code}`;
    const logFile = `[${now}] : ${logMessage} (${time}ms)`;
    switch (code) {
      case 200:
      case 201:
        logMessage = green(logMessage);
      case 400:
      case 404:
      case 422:
      case 500:
        logMessage = red(logMessage);
      default:
        logMessage = white(logMessage);
    }
    let colorlog = `[${white(humanNow)}] : ${logMessage} (${time}ms)`;
    console.log(colorlog);
    fs.appendFile(
      pathname.resolve(__dirname, "../logs/serverlog.txt"),
      `${logFile}\n`,
      err => {
        if (err) console.log(err);
      }
    );
  });

  next();
};

module.exports = awesomeLogger;
