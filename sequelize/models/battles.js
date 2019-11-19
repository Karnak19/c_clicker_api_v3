const Sequelize = require("sequelize");
const sequelize = require("../index");

const Battle = sequelize.define(
  "Battle",
  {
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    teamOne: {
      type: Sequelize.UUID,
      allowNull: false
    },
    teamTwo: {
      type: Sequelize.UUID,
      allowNull: false
    },
    teamOneScore: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    teamTwoScore: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {}
);

module.exports = Battle;
