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

describe("GraphQL", () => {
  describe("users query", () => {
    it("should return collection of users", done => {
      const userSample = {
        pseudo: "Jane Doe",
        score: 0
      };
      User.create(userSample).then(createdUser => {
        chai
          .request(server)
          .post("/graphql")
          .send({ query: `{users{uuid pseudo score}}` })
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(200);
            const body = res.body;
            body.should.be.a("object");
            body.data.should.be.a("object");
            body.data.users.should.be.a("array");
            body.data.users.length.should.be.eql(1);
            body.data.users[0].should.include(userSample);
            done();
          });
      });
    });
  });
  describe("userByID query", () => {
    it("should return an unique user", done => {
      const userSample = {
        pseudo: "Jane Doe",
        score: 0
      };
      User.create(userSample).then(createdUser => {
        chai
          .request(server)
          .post("/graphql")
          .send({
            query: `{userByID(uuid:"${createdUser.uuid}"){uuid pseudo score}}`
          })
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(200);
            const body = res.body;
            body.should.be.a("object");
            body.data.should.be.a("object");
            body.data.userByID.should.be.a("object");
            // body.data.userByID.should.have.keys("uuid", "pseudo", "score");
            // body.data.userByID.should.include(userSample);
            done();
          });
      });
    });
  });
  describe("createUser mutation", () => {
    it("should create a new user", done => {
      chai
        .request(server)
        .post("/graphql")
        .send({
          query: `mutation createUser{ createUser(userInput: {pseudo: "Jane Doe"}){uuid pseudo score}}`
        })
        .end((err, res) => {
          if (err) return done(err);
          res.should.have.status(200);
          const body = res.body;
          body.data.should.be.a("object");
          body.data.createUser.should.be.a("object");
          body.data.createUser.should.have.keys("uuid", "pseudo", "score");
          body.data.createUser.should.include({ pseudo: "Jane Doe" });
          done();
        });
    });
  });
  describe("userClick mutation", () => {
    it("should create a new user", done => {
      const userSample = {
        pseudo: "Jane Doe",
        score: 0
      };
      User.create(userSample).then(createdUser => {
        chai
          .request(server)
          .post("/graphql")
          .send({
            query: `mutation userClick{ userClick(uuid: "${createdUser.uuid}"){uuid pseudo score}}`
          })
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(200);
            const body = res.body;
            body.data.should.be.a("object");
            body.data.userClick.should.be.a("object");
            body.data.userClick.should.have.keys("uuid", "pseudo", "score");
            body.data.userClick.should.include({ pseudo: "Jane Doe" });
            done();
          });
      });
    });
  });
});
