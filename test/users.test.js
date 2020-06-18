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
const errorKeys = ["status", "message"];
const userKeys = [
  "uuid",
  "pseudo",
  "score",
  "TeamUuid",
  "createdAt",
  "updatedAt",
  "Team"
];
let team;
let user;

describe("User", () => {
  before(async () => {
    await sequelize.sync({ force: true });
    team = await Team.create(teamSample);

    user = {
      ...userSample,
      TeamUuid: team.uuid
    };
    user = await User.create(user);
  });

  describe("GET USERS", () => {
    it("should return collection of users", async () => {
      try {
        const res = await chai.request(server).get("/api/v1/users");

        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        res.body[0].should.have.keys(userKeys);
        res.body[0].should.include(userSample);
      } catch (err) {
        throw err;
      }
    });
  });
  describe("GET AN USER", () => {
    it("should return an unique user", async () => {
      try {
        const res = await chai
          .request(server)
          .get(`/api/v1/users/${user.uuid}`);

        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.include(userSample);
      } catch (err) {
        throw err;
      }
    });
  });
  describe("PUT USER SCORE", () => {
    it("should increment user score", async () => {
      const res = await chai
        .request(server)
        .put(`/api/v1/users/${user.uuid}/click`);
      res.should.have.status(204);
    });
    it("should return 404", async () => {
      try {
        const res = await chai
          .request(server)
          .put(`/api/v1/users/regexpfail/click`);

        res.should.have.status(404);
        res.body.should.have.keys(errorKeys);
      } catch (err) {
        throw err;
      }
    });
  });

  describe("POST NEW USER", () => {
    it("should post a new user", async () => {
      try {
        const res = await chai
          .request(server)
          .post("/api/v1/users")
          .send({ ...userSample, team: team.uuid });

        res.should.have.status(201);
        res.body.should.be.a("object");

        res.body.should.have.keys(userKeys.filter(k => k !== "Team"));
      } catch (err) {
        throw err;
      }
    });
    it("should FAIL to post a new user", async () => {
      try {
        const res = await chai
          .request(server)
          .post(`/api/v1/users`)
          .send({
            pseud: "Jane Doe"
          });

        res.should.have.status(422);
      } catch (err) {
        throw err;
      }
    });
  });
});
