const Joi = require("joi");

const joiValidation = (schema, propWhoNeedValidation) => (req, res, next) => {
  const { error } = Joi.validate(req[propWhoNeedValidation], schema);
  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map(i => i.message).join(",");
    res.status(422).json({
      error: message
    });
  }
};

module.exports = joiValidation;
