const Joi = require("joi");

const { urlImgRegExp } = require("./middlewares/regexpCheck");

module.exports.usersPost = Joi.object().keys({
  pseudo: Joi.string().required(),
  team: Joi.string()
    .guid({ version: "uuidv4" })
    .required()
});

module.exports.teamsPost = Joi.object().keys({
  name: Joi.string().required(),
  logo: Joi.string().regex(urlImgRegExp)
});
