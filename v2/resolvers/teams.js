const sequelize = require("sequelize");
const uuidv4 = require("uuid/v4");
const Team = require("../../sequelize/models/teams");
const User = require("../../sequelize/models/users");

module.exports = {
  teams: async () => {
    const teams = await Team.findAll({
      include: [{ model: User, as: "users" }]
    });
    try {
      return teams;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  teamByID: ({ uuid }) => {
    return Team.findOne({
      where: {
        uuid: uuid
      },
      include: [{ model: User, as: "users" }]
    })
      .then(result => result)
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  createTeam: ({ teamInput }) => {
    const { name } = teamInput;
    const team = {
      uuid: uuidv4(),
      name,
      logo
    };
    return Team.create(team).then(result => {
      return result;
    });
  }
};
