const { buildSchema } = require("graphql");

// TODO: Create Team type and queries/mutations

module.exports = buildSchema(`
  type User {
    id: String!
    pseudo: String!
    score: Int!
    teamId: String!
  }

  type Team {
    id: String!
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
    userByID(id: String!) : User!
    teams: [Team!]!
    teamByID(id: String!): Team!
  }
  
  type RootMutation {
    createUser(userInput: UserInput): User
    userClick(id: String!): User
    createTeam(teamInput: TeamInput): Team
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
