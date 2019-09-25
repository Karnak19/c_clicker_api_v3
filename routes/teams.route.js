const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");

// custom Middlewares
const regExpIntegrityCheck = require("../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../middlewares/regexpCheck");

const joiValidate = require("../middlewares/joiValidate");
const { teamsPost } = require("../joiSchemas");

// Reach Sequelize models
const Team = require("../sequelize/models/teams");
const User = require("../sequelize/models/users");

// Console Logging
const awesomeLogger = require("../middlewares/awesomeLogger");

if (process.env.NODE_ENV != "test") {
  router.use(awesomeLogger);
}

router.get("/", (req, res) => {
  Team.findAll({ include: [{ model: User, as: "users" }] })
    .then(teams => res.status(200).json(teams))
    .catch(err => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    });
});

router.get("/:uuid/users", regExpIntegrityCheck(uuidv4RegExp), (req, res) => {
  const teamUuid = req.params.uuid;
  User.findAll({
    where: {
      TeamUuid: teamUuid
    }
  })
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    });
});

router.post("/", joiValidate(teamsPost, "body"), (req, res) => {
  const payload = req.body;
  const uuid = uuidv4();
  const newTeam = {
    uuid,
    ...payload
  };

  Team.create(newTeam)
    .then(result => res.status(201).json(result))
    .catch(err => {
      res.status(400).json({
        status: "error",
        message: `invalid request`
      });
    });
});

// TODO: finish the CRUD here

module.exports = router;
