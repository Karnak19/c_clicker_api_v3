const fs = require("fs");
const pathname = require("path");
const chalk = require("chalk");
const green = chalk.bold.green;
const red = chalk.bold.red;
const white = chalk.bold.white;

const noOp = a => a;

const log = ({ startDate, method, path, code, time, color }) => {
  const msg = `[${startDate}] : ${(color ? color : noOp)(
    `${method} ${path} ${code}`
  )} (${time}ms)`;
  return msg;
};
const color = code => {
  let color;
  switch (code) {
    case 200:
    case 201:
      color = green;
      break;
    case 400:
    case 404:
    case 500:
      color = red;
      break;
    default:
      color = white;
      break;
  }
  return color;
};

const awesomeLogger = (
  logger = log,
  colorer = color,
  file = "../logs/serverlog.txt"
) => (req, res, next) => {
  const now = Date.now();
  res.on("finish", function() {
    const path = req.originalUrl;
    const method = req.method;
    const code = this.statusCode;
    const time = Date.now() - now;
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
    fs.appendFile(
      pathname.resolve(__dirname, file),
      `${uncoloredMsg}\n`,
      err => {
        if (err) console.log(err);
      }
    );
  });
  next();
};

module.exports = awesomeLogger;
