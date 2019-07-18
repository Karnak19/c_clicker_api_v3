const express = require("express");
const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const Joi = require("joi");
const router = express.Router();

// Reach Sequelize model
const User = require("../sequelize/models/users");

// RegExp for uuid v4 integrity
const uuidv4RegExp = /[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/i;

// Logging date
if (process.env.NODE_ENV != "test") {
  const chalk = require("chalk");
  const blue = chalk.cyan;
  router.use(function timeLog(req, res, next) {
    let newDate = new Date(Date.now());
    console.log(blue(`${newDate.toDateString()} ${newDate.toTimeString()}`));
    next();
  });
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
router.get("/:uuid", (req, res) => {
  const uuid = req.params.uuid;

  if (uuidv4RegExp.test(uuid)) {
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
  } else {
    res.status(404).json({
      status: "error",
      message: "user not found"
    });
  }
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
router.put("/:uuid/click", (req, res) => {
  const userUuid = req.params.uuid;

  if (uuidv4RegExp.test(userUuid)) {
    User.update(
      { score: sequelize.literal("score+1") },
      { where: { uuid: userUuid } }
    )
      .then(result => res.status(200).json(result))
      .catch(err => {
        console.log(err);
        res.status(400).json({
          status: "error",
          message: "invalid request"
        });
      });
  } else {
    res.status(404).json({
      status: "error",
      message: "user not found"
    });
  }
});

module.exports = router;
