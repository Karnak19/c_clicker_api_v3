const client = require("../../prisma/client");
const { user } = require("../../prisma/client");

module.exports = {
  users: async () => {
    try {
      return await user.findAll();
    } catch (err) {
      throw err;
    }
  },
  userByID: async ({ id }) => {
    return await user.findUnique({
      where: {
        id
      }
    });
  },
  userClick: async ({ id }) => {
    await prisma.$executeRaw`update "User" set score = score + 1 where id = ${id};`;

    return await user.findUnique({
      where: {
        id
      }
    });
  },
  createUser: async ({ userInput: { pseudo, team } }) => {
    return await user.create({
      data: {
        pseudo,
        id,
        teamId: team,
        score: 0
      }
    });
  }
};
