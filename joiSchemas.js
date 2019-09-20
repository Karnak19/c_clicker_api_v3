const Joi = require("joi");

module.exports.usersPost = Joi.object().keys({
  pseudo: Joi.string().required(),
  team: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
});

module.exports.teamsPost = Joi.object().keys({
  name: Joi.string().required()
});
