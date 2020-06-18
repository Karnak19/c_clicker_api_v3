const userResolver = require("./users");
const teamResolver = require("./teams");

const rootResolver = {
  ...teamResolver,
  ...userResolver
};

module.exports = rootResolver;

//https://github.com/academind/yt-graphql-react-event-booking-api/blob/05-user-model-and-connection/app.js
