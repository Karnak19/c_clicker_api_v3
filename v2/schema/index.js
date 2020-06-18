const { buildSchema } = require("graphql");

// TODO: Create Team type and queries/mutations

module.exports = buildSchema(`
  type User {
    uuid: String!
    pseudo: String!
    score: Int!
    TeamUuid: String!
  }

  type Team {
    uuid: String!
    name: String!
    logo: String!
    users: [User!]
  }

  input UserInput {
    pseudo: String!
    team: String!
  }

  input TeamInput {
    name: String!
  }

  type RootQuery {
    users : [User!]!
    userByID(uuid: String!) : User!
    teams: [Team!]!
    teamByID(uuid: String!): Team!
  }
  
  type RootMutation {
    createUser(userInput: UserInput): User
    userClick(uuid: String!): User
    createTeam(teamInput: TeamInput): Team
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
