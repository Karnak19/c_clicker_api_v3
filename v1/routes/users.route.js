const express = require("express");
const router = express.Router();
const sequelize = require("sequelize");

// custom Middlewares
const regExpIntegrityCheck = require("../../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../../middlewares/regexpCheck");

const joiValidate = require("../../middlewares/joiValidate");
const { usersPost } = require("../../joiSchemas");

// Reach Sequelize models
const User = require("../../sequelize/models/users");
const Team = require("../../sequelize/models/teams");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Team }] });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: "Invalid request"
    });
  }
});

// Get an user
router.get("/:uuid", regExpIntegrityCheck(uuidv4RegExp), async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await User.findOne({
      where: {
        uuid: uuid
      },
      include: [{ model: Team }]
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid request"
    });
  }
});

// Post an user
router.post("/", joiValidate(usersPost, "body"), async (req, res) => {
  const { team, pseudo } = req.body;
  try {
    const score = 0;
    const user = {
      pseudo,
      TeamUuid: team,
      score
    };
    const result = await User.create(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `invalid request`
    });
  }
});

// Increment score
router.put(
  "/:uuid/click",
  regExpIntegrityCheck(uuidv4RegExp),
  async (req, res) => {
    const userUuid = req.params.uuid;
    try {
      await User.update(
        { score: sequelize.literal("score+1") },
        { where: { uuid: userUuid } }
      );
      res.status(204).end();
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "invalid request"
      });
    }
  }
);

module.exports = router;
