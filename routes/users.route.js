const express = require("express");
const router = express.Router();

// Reach Sequelize model
const User = require("../sequelize/models/users");

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

// Get all users
router.get("/", (req, res) => {
  User.findAll()
    .then(users => res.json(users))
    .catch(err => console.log(err));
});

// Post an user
router.post("/", (req, res) => {
  const user = req.body;

  User.create(user)
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

module.exports = router;
