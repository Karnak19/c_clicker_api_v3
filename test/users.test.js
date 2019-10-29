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
describe("User", () => {
  describe("GET USERS", () => {
    it("should return collection of users", done => {
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
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
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
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
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
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
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
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
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
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
