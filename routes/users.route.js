const express = require("express");
const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const Joi = require("joi");
const router = express.Router();

const regExpIntegrityCheck = require("../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../middlewares/regexpCheck");
// Reach Sequelize model
const User = require("../sequelize/models/users");

// Console Logging
const awesomeLogger = require("../middlewares/samiLogger");
// const awesomeLogger = require("../middlewares/awesomeLogger");

if (process.env.NODE_ENV != "test") {
  router.use(awesomeLogger());
}

// Get all users
router.get("/", (req, res) => {
  User.findAll()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    });
});

// Get an user
router.get("/:uuid", regExpIntegrityCheck(uuidv4RegExp), (req, res) => {
  const uuid = req.params.uuid;

  User.findOne({
    where: {
      uuid: uuid
    }
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

// Post an user
router.post("/", (req, res) => {
  const payload = req.body;
  const schema = Joi.object().keys({
    pseudo: Joi.string().required()
  });

  Joi.validate(payload, schema, (err, value) => {
    const score = 0;
    const uuid = uuidv4();
    const user = {
      uuid,
      ...payload,
      score
    };
    if (!err) {
      User.create(user)
        .then(result => res.status(201).json(result))
        .catch(err => {
          res.status(400).json({
            status: "error",
            message: `invalid request body`
          });
        });
    } else {
      res.status(400).json({
        status: "error",
        message: "invalid request body",
        err
      });
    }
  });
});

// Increment score
router.put("/:uuid/click", regExpIntegrityCheck(uuidv4RegExp), (req, res) => {
  const userUuid = req.params.uuid;

  User.update(
    { score: sequelize.literal("score+1") },
    { where: { uuid: userUuid } }
  )
    .then(result => res.status(200).end())
    .catch(err => {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: "invalid request"
      });
    });
});

module.exports = router;
