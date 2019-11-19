let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let server = require("../index");
const sequelize = require("../sequelize");
const User = require("../sequelize/models/users");
const Team = require("../sequelize/models/teams");

chai.use(chaiHttp);

beforeEach(() => {
  return sequelize.sync({ force: true });
});

const teamSample = {
  name: "Foo Bar",
  logo: "https://www.stickpng.com/assets/images/5848152fcef1014c0b5e4967.png"
};
const userSample = {
  pseudo: "Jane Doe"
};

const teamKeys = ["uuid", "name", "users", "logo", "createdAt", "updatedAt"];
const userKeys = [
  "uuid",
  "pseudo",
  "score",
  "TeamUuid",
  "createdAt",
  "updatedAt",
  "BattleUuid"
];

describe("Team", () => {
  describe("GET TEAMS", () => {
    it("should return collection of teams", done => {
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .get("/teams")
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(1);
              const dataToTest = res.body[0];
              dataToTest.should.have.keys(teamKeys);
              dataToTest.users.length.should.be.eql(1);
              dataToTest.users.should.be.a("array");
              dataToTest.users[0].should.have.keys(userKeys);
              dataToTest.users[0].should.include(user);
              done();
            });
        });
      });
    });
  });
  describe("GET A TEAM", () => {
    it("should return an unique team", done => {
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .get(`/teams/${uuid}`)
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.include(teamSample);
              res.body.should.have.keys(teamKeys);
              res.body.users.should.be.a("array");
              res.body.users[0].should.have.keys(userKeys);
              res.body.users[0].should.include(user);
              done();
            });
        });
      });
    });
  });
  describe("POST NEW TEAM", () => {
    it("should post a new team", done => {
      chai
        .request(server)
        .post("/teams")
        .send(teamSample)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(201);
          res.body.should.be.a("object");
          const teamKeysWithoutUsers = teamKeys.filter(key => key !== "users");
          res.body.should.have.keys(teamKeysWithoutUsers);
          done();
        });
    });
  });
});
