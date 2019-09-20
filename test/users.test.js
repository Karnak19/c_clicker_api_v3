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

describe("User", () => {
  describe("GET USERS", () => {
    it("should return collection of users", done => {
      const team = {
        name: "Foo Bar"
      };
      Team.create(team).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          pseudo: "Jane Doe",
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .get("/users")
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              res.body.should.be.a("array");
              res.body.length.should.be.eql(1);
              res.body[0].should.include(user);
              done();
            });
        });
      });
    });
  });
  describe("GET AN USER", () => {
    it("should return an unique user", done => {
      const team = {
        name: "Foo Bar"
      };
      Team.create(team).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          pseudo: "Jane Doe",
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .get(`/users/${createdUser.uuid}`)
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.include(user);
              done();
            });
        });
      });
    });
  });
  describe("PUT USER SCORE", () => {
    it("should increment user score", done => {
      const team = {
        name: "Foo Bar"
      };
      Team.create(team).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          pseudo: "Jane Doe",
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .put(`/users/${createdUser.uuid}/click`)
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              done();
            });
        });
      });
    });
    it("should return 404", done => {
      const team = {
        name: "Foo Bar"
      };
      Team.create(team).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          pseudo: "Jane Doe",
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .put(`/users/regexpfail/click`)
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(404);
              res.body.should.have.keys("status", "message");
              done();
            });
        });
      });
    });
  });
  describe("POST NEW USER", () => {
    it("should post a new user", done => {
      const team = {
        name: "Foo Bar"
      };
      Team.create(team).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          pseudo: "Jane Doe",
          team: uuid
        };
        chai
          .request(server)
          .post("/users")
          .send(user)
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.keys(
              "uuid",
              "pseudo",
              "score",
              "TeamUuid",
              "createdAt",
              "updatedAt"
            );
            done();
          });
      });
    });
    it("should FAIL to post a new user", done => {
      const user = {
        pseud: "Jane Doe"
      };
      chai
        .request(server)
        .post(`/users`)
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(422);
          done();
        });
    });
  });
});
