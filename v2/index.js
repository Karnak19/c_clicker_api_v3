const graphqlHttp = require("express-graphql");
const graphQlSchemas = require("./schema");
const graphQlResolvers = require("./resolvers");

module.exports = graphqlHttp({
  schema: graphQlSchemas,
  rootValue: graphQlResolvers,
  graphiql: true
});
