const express = require("express");
const router = express.Router();

// custom Middlewares
const regExpIntegrityCheck = require("../../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../../middlewares/regexpCheck");

const joiValidate = require("../../middlewares/joiValidate");
const { usersPost } = require("../../joiSchemas");
const prisma = require("../../prisma/client");
const { user } = require("../../prisma/client");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await user.findMany();
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
    const user = await user.findUnique({
      where: {
        id: uuid
      },
      include: {
        team: true
      }
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
    const result = await user.create({
      data: {
        pseudo,
        score: 0,
        team: {
          connect: {
            id: team
          }
        }
      }
    });
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
      await prisma.$executeRaw`update "User" set score = score + 1 where id = ${userUuid};`;

      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "error",
        message: "invalid request"
      });
    }
  }
);

module.exports = router;
