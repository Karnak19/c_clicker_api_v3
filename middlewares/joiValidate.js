const Joi = require("@hapi/joi");

const joiValidation = (schema, propWhoNeedValidation) => (req, res, next) => {
  const { error } = schema.validate(req[propWhoNeedValidation], {
    abortEarly: false
  });
  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    console.log(error);

    res.status(422).json(details);
  }
};

module.exports = joiValidation;
