const Joi = require("@hapi/joi");

const { urlImgRegExp } = require("./middlewares/regexpCheck");

module.exports.usersPost = Joi.object({
  pseudo: Joi.string().required(),
  team: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
});

module.exports.teamsPost = Joi.object({
  name: Joi.string().required(),
  logo: Joi.string().regex(urlImgRegExp)
});

module.exports.battlesPost = Joi.object({
  teamOne: Joi.string()
    .guid({ version: "uuidv4" })
    .required(),
  teamTwo: Joi.string()
    .guid({ version: "uuidv4" })
    .required(),
  teamOneScore: Joi.number().required(),
  teamTwoScore: Joi.number().required()
});
