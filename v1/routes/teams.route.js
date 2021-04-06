const express = require("express");
const router = express.Router();

// custom Middlewares
const regExpIntegrityCheck = require("../../middlewares/regexpCheck");
const { uuidv4RegExp } = require("../../middlewares/regexpCheck");

const joiValidate = require("../../middlewares/joiValidate");
const { teamsPost } = require("../../joiSchemas");

const { team, user, $executeRaw } = require("../../prisma/client");

router.get("/", async (req, res) => {
  try {
    const teams = await team.findMany();

    res.status(200).json(teams);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid request"
    });
  }
});

router.get("/:uuid", regExpIntegrityCheck(uuidv4RegExp), async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const result = await team.findUnique({
      where: {
        id: uuid
      },
      include: {
        users: true
      }
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Invalid request"
    });
  }
});

router.get(
  "/:uuid/users",
  regExpIntegrityCheck(uuidv4RegExp),
  async (req, res) => {
    const teamUuid = req.params.uuid;
    try {
      const rest = await user.findMany({
        where: {
          teamId: teamUuid
        }
      });

      res.status(200).json(rest);
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Invalid request"
      });
    }
  }
);

router.post("/", joiValidate(teamsPost, "body"), async (req, res) => {
  const payload = req.body;
  try {
    const result = await team.create({
      data: payload
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `invalid request`
    });
  }
});

// TODO: finish the CRUD here

module.exports = router;
