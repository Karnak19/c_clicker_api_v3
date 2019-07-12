const express = require("express");
const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const router = express.Router();

// Reach Sequelize model
const User = require("../sequelize/models/users");

// Logging date
const chalk = require("chalk");
const blue = chalk.cyan;
router.use(function timeLog(req, res, next) {
  let newDate = new Date(Date.now());
  console.log(blue(`${newDate.toDateString()} ${newDate.toTimeString()}`));
  next();
});

// Get all users
router.get("/", (req, res) => {
  User.findAll()
    .then(users => res.json(users))
    .catch(err => console.log(err));
});

// Get an user
router.get("/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  User.findOne({
    where: {
      uuid: uuid
    }
  })
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

// Post an user
router.post("/", (req, res) => {
  const payload = req.body;
  const score = 0;
  const uuid = uuidv4();

  const user = {
    uuid,
    ...payload,
    score
  };
  User.create(user)
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

// Increment score
router.put("/:uuid/click", (req, res) => {
  const userUuid = req.params.uuid;

  User.update(
    {
      score: sequelize.literal("score+1")
    },
    {
      where: {
        uuid: userUuid
      }
    }
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => console.log(err));
});

module.exports = router;
