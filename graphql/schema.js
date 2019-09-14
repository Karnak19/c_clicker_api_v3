const { buildSchema } = require("graphql");

module.exports.schema = buildSchema(`
  type Query {
    hello: String
  }

  type User {
    uuid: String!
    pseudo: String!
    score: Int!
  }

  input UserInput {
    pseudo: String!
  }

  type RootQuery {
    users : [User!]!
  }

  type RootMutation {
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
