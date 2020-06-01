const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");

// custom Middlewares
const regExpIntegrityCheck = require("../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../middlewares/regexpCheck");

const joiValidate = require("../middlewares/joiValidate");
const { usersPost } = require("../joiSchemas");

// Reach Sequelize models
const User = require("../sequelize/models/users");
const Team = require("../sequelize/models/teams");

// Console Logging
const awesomeLogger = require("../middlewares/awesomeLogger");

if (process.env.NODE_ENV != "test") {
  router.use(awesomeLogger);
}

// Get all users
router.get("/", (req, res) => {
  User.findAll({ include: [{ model: Team }] })
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request",
      });
    });
});

// Get an user
router.get("/:uuid", regExpIntegrityCheck(uuidv4RegExp), (req, res) => {
  const uuid = req.params.uuid;

  User.findOne({
    where: {
      uuid: uuid,
    },
    include: [{ model: Team }],
  })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request",
      });
    });
});

// Post an user
router.post("/", joiValidate(usersPost, "body"), (req, res) => {
  const pseudo = req.body.pseudo;
  const team = req.body.team;

  const score = 0;
  const uuid = uuidv4();
  const user = {
    uuid,
    pseudo,
    TeamUuid: team,
    score,
  };
  User.create(user)
    .then((result) => res.status(201).json(result))
    .catch((err) => {
      res.status(400).json({
        status: "error",
        message: `invalid request`,
      });
    });
});

// Increment score
router.put("/:uuid/click", regExpIntegrityCheck(uuidv4RegExp), (req, res) => {
  const userUuid = req.params.uuid;

  User.update({ score: sequelize.literal("score+1") }, { where: { uuid: userUuid } })
    .then((result) => res.status(200).end())
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "invalid request",
      });
    });
});

module.exports = router;
