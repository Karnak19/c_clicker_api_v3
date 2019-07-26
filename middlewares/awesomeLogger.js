const express = require("express");
const fs = require("fs");
const chalk = require("chalk");
const green = chalk.bold.green;
const red = chalk.bold.red;
const white = chalk.bold.white;
const blue = chalk.cyan;

const awesomeLogger = (req, res, next) => {
  let now = new Date().toLocaleString();
  let method = req.method;
  let path = req.originalUrl;
  res.on("finish", function() {
    let code = this.statusCode;
    let logMessage = `${method} ${path} ${code}`;
    let logFile = `[${now}] : ${logMessage}`;
    switch (code) {
      case 200:
        logMessage = green(logMessage);
      case 201:
        logMessage = green(logMessage);
      case 400:
        logMessage = red(logMessage);
      case 404:
        logMessage = red(logMessage);
      case 500:
        logMessage = red(logMessage);
      default:
        logMessage = white(logMessage);
    }
    let colorlog = `[${white(now)}] : ${logMessage}`;
    console.log(colorlog);
    fs.appendFile("./logs/serverlog.txt", `${logFile}\n`, err => {
      if (err) console.log(err);
    });
  });

  next();
};

module.exports = awesomeLogger;
