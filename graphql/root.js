const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const Joi = require("joi");
const User = require("../sequelize/models/users");

export const root = {
  hello: () => "Hello world !",
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
  createUser: args => {
    const uuid = uuidv4();
    const score = 0;
    const user = {
      uuid,
      ...args.userInput,
      score
    };
    return User.create(user)
      .then()
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};

//https://github.com/academind/yt-graphql-react-event-booking-api/blob/05-user-model-and-connection/app.js
