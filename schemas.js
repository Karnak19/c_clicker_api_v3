const Joi = require("joi");

module.exports.usersPost = Joi.object().keys({
  pseudo: Joi.string().required()
});
