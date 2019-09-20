const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const Joi = require("joi");
const User = require("../../sequelize/models/users");

module.exports = {
  users: () => {
    return User.findAll()
      .then(users => {
        return users;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  userByID: ({ uuid }) => {
    return User.findOne({
      where: {
        uuid: uuid
      }
    })
      .then(result => result)
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  userClick: async ({ uuid }) => {
    await User.update(
      { score: sequelize.literal("score+1") },
      {
        where: { uuid: uuid },
        returning: process.env.NODE_ENV === "production" ? true : false,
        plain: process.env.NODE_ENV === "production" ? true : false
      }
    );
    const updatedUser = await User.findOne({
      where: {
        uuid: uuid
      }
    });
    return updatedUser;
  },
  createUser: ({ userInput }) => {
    const { pseudo, team } = userInput;
    const uuid = uuidv4();
    const score = 0;
    const user = {
      uuid,
      pseudo,
      TeamUuid: team,
      score
    };
    return User.create(user)
      .then(result => {
        return result;
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};
