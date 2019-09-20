const { buildSchema } = require("graphql");

// TODO: Create Team type and queries/mutations

module.exports = buildSchema(`
  type User {
    uuid: String!
    pseudo: String!
    score: Int!
    TeamUuid: String!
  }

  input UserInput {
    pseudo: String!
    team: String!
  }

  type RootQuery {
    users : [User!]!
    userByID(uuid: String!) : User!
  }
  
  type RootMutation {
    createUser(userInput: UserInput): User
    userClick(uuid: String!): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
