const User = require("./models/users");
const Team = require("./models/teams");
const Battle = require("./models/battles");

Team.hasMany(User, { foreignKey: { allowNull: false }, as: "users" });
Battle.hasMany(User, {
  foreignKey: { name: "BattleUuid", allowNull: true },
  as: "users"
});
User.belongsTo(Team, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
