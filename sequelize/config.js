require("dotenv").config();

const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PW;
let database = process.env.DB_DATABASE;
let dialect = process.env.DB_DIALECT;

if (process.env.NODE_ENV === "test") {
  database = process.env.DB_DATABASE_TEST;
}

const conf = {
  host,
  username,
  password,
  database,
  dialect,
  logging: false
};

module.exports = conf;
