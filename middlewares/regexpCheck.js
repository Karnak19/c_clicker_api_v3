module.exports = function(req, res, next) {
  const uuidv4RegExp = /[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/i;
  if (uuidv4RegExp.test(req.params.uuid)) {
    next();
  } else {
    res.status(404).json({
      status: "error",
      message: "user not found"
    });
  }
};
