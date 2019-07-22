module.exports = (regex, msg) =>
  function(req, res, next) {
    if (regex.test(req.params.uuid)) {
      next();
    } else {
      res.status(404).json({
        status: "error",
        message: msg || "user not found"
      });
    }
  };
module.exports.uuidv4RegExp = /[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/i;
