const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const sequelize = require("sequelize");

// Reach Sequelize Model
const Battle = require("../sequelize/models/battles");
const User = require("../sequelize/models/users");

const regExpIntegrityCheck = require("../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../middlewares/regexpCheck");

const joiValidate = require("../middlewares/joiValidate");
const { battlesPost, teamUuid } = require("../joiSchemas");

// Logger
const awesomeLogger = require("../middlewares/awesomeLogger");
if (process.env.NODE_ENV != "test") {
  router.use(awesomeLogger);
}

router.get("/", (req, res) => {
  Battle.findAll({ include: [{ model: User, as: "users" }] })
    .then(battles => res.status(200).json(battles))
    .catch(err => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    });
});

router.get("/:uuid", regExpIntegrityCheck(uuidv4RegExp), (req, res) => {
  const uuid = req.params.uuid;
  Battle.findOne({
    where: {
      uuid: uuid
    },
    include: [{ model: User, as: "users" }]
  })
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    });
});

router.post("/", joiValidate(battlesPost, "body"), (req, res) => {
  const payload = req.body;
  Battle.create(payload)
    .then(newBattle => {
      res.send(newBattle);
    })
    .catch(err => {
      res.status(400).json({
        status: "error",
        message: `invalid request`
      });
    });
});

router.put(
  "/:uuid",
  regExpIntegrityCheck(uuidv4RegExp),
  joiValidate(teamUuid, "body"),
  (req, res) => {
    const battleuuid = req.params.uuid;
    const { team } = req.body;

    Battle.findOne({
      where: {
        uuid: battleuuid
      }
    })
      .then(result => {
        let payload;
        if (team === result.teamTwo) {
          payload = { teamOneScore: sequelize.literal("teamOneScore-1") };
        } else if (team === result.teamOne) {
          payload = { teamTwoScore: sequelize.literal("teamTwoScore-1") };
        } else {
          res.status(400).json({
            status: "error",
            message: "Invalid request"
          });
        }
        return Battle.update(payload, { where: { uuid: battleuuid } });
      })
      .then(result => {
        res.status(200).end();
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: "error",
          message: "Invalid request"
        });
      });
  }
);

module.exports = router;
