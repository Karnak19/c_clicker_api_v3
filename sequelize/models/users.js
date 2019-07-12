const Sequelize = require("sequelize");
const sequelize = require("../index");

const User = sequelize.define(
  "User",
  {
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    pseudo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    score: {
      type: Sequelize.INTEGER
    }
  },
  {}
);

module.exports = User;
