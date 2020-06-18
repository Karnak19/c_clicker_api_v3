let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let server = require("../index");
const sequelize = require("../sequelize");
const User = require("../sequelize/models/users");
const Team = require("../sequelize/models/teams");

chai.use(chaiHttp);

const teamSample = {
  name: "Foo Bar",
  logo: "https://www.stickpng.com/assets/images/5848152fcef1014c0b5e4967.png"
};
const userSample = {
  pseudo: "Jane Doe"
};
let team;
let user;

const errorKeys = ["status", "message"];
const teamKeys = ["uuid", "name", "users", "logo", "createdAt", "updatedAt"];
const userKeys = [
  "uuid",
  "pseudo",
  "score",
  "TeamUuid",
  "createdAt",
  "updatedAt"
];

describe("Team", () => {
  before(async () => {
    await sequelize.sync({ force: true });
    team = await Team.create(teamSample);

    user = {
      ...userSample,
      TeamUuid: team.uuid
    };
    await User.create(user);
  });

  describe("GET TEAMS", () => {
    it("should return collection of teams", async () => {
      try {
        const res = await chai.request(server).get("/api/v1/teams");
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        const dataToTest = res.body[0];
        dataToTest.should.have.keys(teamKeys);
        dataToTest.users.length.should.be.eql(1);
        dataToTest.users.should.be.a("array");
        dataToTest.users[0].should.have.keys(userKeys);
        dataToTest.users[0].should.include(user);
      } catch (err) {
        throw err;
      }
    });
  });

  describe("GET A TEAM", () => {
    it("should return an unique team", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/api/v1/teams/${team.uuid}`);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.include(teamSample);
        res.body.should.have.keys(teamKeys);
        res.body.users.should.be.a("array");
        res.body.users[0].should.have.keys(userKeys);
        res.body.users[0].should.include(user);
      } catch (err) {
        throw err;
      }
    });

    it("Should fail finding a team", async () => {
      try {
        const res = await chai.request(server).get(`/api/v1/teams/failing`);

        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.keys(errorKeys);
      } catch (err) {
        throw err;
      }
    });
  });
  describe("POST NEW TEAM", () => {
    it("should post a new team", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/api/v1/teams")
          .send(teamSample);

        res.should.have.status(201);
        res.body.should.be.a("object");
        const teamKeysWithoutUsers = teamKeys.filter(key => key !== "users");
        res.body.should.have.keys(teamKeysWithoutUsers);
      } catch (err) {
        throw err;
      }
    });
  });
});
