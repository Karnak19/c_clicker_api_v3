const User = require("./models/users");
const Team = require("./models/teams");

Team.hasMany(User, { foreignKey: { allowNull: false }, as: "users" });
User.belongsTo(Team, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
