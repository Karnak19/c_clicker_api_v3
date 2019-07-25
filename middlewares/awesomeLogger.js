const express = require("express");
const fs = require("fs");
// const chalk = require("chalk");
// const green = chalk.bold.green;
// const red = chalk.bold.red;
// const white = chalk.bold.white;

const awesomeLogger = (req, res, next) => {
  let now = new Date().toDateString();
  let { method, path } = req;
  let log = `${now} : ${method} ${path}`;

  console.log(log);
  fs.appendFile("./logs/serverlog.txt", `${log}\n`, err => {
    if (err) console.log(err);
  });
  next();
};

module.exports = awesomeLogger;
