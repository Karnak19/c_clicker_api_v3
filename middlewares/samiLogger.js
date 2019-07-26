const express = require("express");
const fs = require("fs");
const chalk = require("chalk");
const green = chalk.bold.green;
const red = chalk.bold.red;
const white = chalk.bold.white;
const blue = chalk.cyan;

const noOp = a => a;

const logger = ({ startDate, method, path, code, time, color }) => {
  const msg = `[${startDate}] : ${(color ? color : noOp)(
    `${method} ${path} ${code}`
  )} (${time})`;
  return msg;
};
const colorer = code => {
  let color;
  switch (code) {
    case 200:
    case 201:
      color = green;
    case 400:
    case 404:
    case 500:
      color = red;
    default:
      color = white;
  }
  return color;
};

const awesomeLogger = ({
  logger = logger,
  colorer = colorer,
  file = "./logs/serverlog.txt"
}) => (req, res, next) => {
  const now = Date.now();
  res.on("finish", function() {
    const path = req.originalUrl;
    const method = req.method;
    const code = this.statusCode;
    const time = now - Date.now();
    const color = colorer(code);
    const uncoloredMsg = logger({
      startDate: new Date(now).toLocaleString(),
      path,
      method,
      code,
      time
    });
    const coloredMsg = logger({
      startDate: new Date(now).toLocaleString(),
      path,
      method,
      code,
      time,
      color
    });
    console.log(coloredMsg);
    fs.appendFile(file, `${uncoloredMsg}\n`, err => {
      if (err) console.log(err);
    });
  });
  next();
};

module.exports = awesomeLogger;
