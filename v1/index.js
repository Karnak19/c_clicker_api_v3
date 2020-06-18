const express = require("express");

const awesomeLogger = require("../middlewares/awesomeLogger");

const router = express.Router();

if (process.env.NODE_ENV !== "test") {
  // router.use(awesomeLogger);
}

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the v1 API."
  });
});

router.use("/users", require("./routes/users.route"));
router.use("/teams", require("./routes/teams.route"));

module.exports = router;
