let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let server = require("../index");
const sequelize = require("../sequelize");
const User = require("../sequelize/models/users");

chai.use(chaiHttp);

beforeEach(() => {
  return sequelize.sync({ force: true });
});

describe("User", () => {
  describe("GET USERS", () => {
    it("should return collection of users", done => {
      const user = {
        pseudo: "Jane Doe"
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
  describe("GET AN USER", () => {
    it("should return an unique user", done => {
      const user = {
        pseudo: "Jane Doe"
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
  describe("PUT USER SCORE", () => {
    it("should increment user score", done => {
      const user = {
        pseudo: "Jane Doe"
      };
      User.create(user).then(createdUser => {
        chai
          .request(server)
          .put(`/users/${createdUser.uuid}/click`)
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(1);
            done();
          });
      });
    });
    it("should return 404", done => {
      const user = {
        pseudo: "Jane Doe"
      };
      User.create(user).then(createdUser => {
        chai
          .request(server)
          .put(`/users/regexpfail/click`)
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(404);
            done();
          });
      });
    });
  });
  describe("POST NEW USER", () => {
    it("should post a new user", done => {
      const user = {
        pseudo: "Jane Doe"
      };
      chai
        .request(server)
        .post(`/users`)
        .send(user)
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.include(user);
          done();
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
          res.should.have.status(400);
          done();
        });
    });
  });
});
