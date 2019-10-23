const sequelize = require("./index");
require("./associations");

sequelize.sync({ force: true }).then(() => {
  console.log("Successfully resync Database !");
  process.exit(0);
});
