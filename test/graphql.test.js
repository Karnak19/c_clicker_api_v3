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
  pseudo: "Jane Doe",
  score: 0
};

describe("GraphQL", () => {
  // TEAMS QUERIES
  describe("teams query", () => {
    it("shourld return collection of teams", done => {
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .post("/graphql")
            .send({
              query: `{teams{uuid name logo users{uuid pseudo score TeamUuid}}}`
            })
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              const body = res.body;
              body.should.be.a("object");
              body.data.should.be.a("object");
              body.data.teams.should.be.a("array");
              body.data.teams.length.should.be.eql(1);
              body.data.teams[0].should.have.keys(
                "uuid",
                "name",
                "users",
                "logo"
              );
              body.data.teams[0].users.length.should.be.eql(1);
              body.data.teams[0].users.should.be.a("array");
              body.data.teams[0].users[0].should.have.keys(
                "uuid",
                "pseudo",
                "score",
                "TeamUuid"
              );
              body.data.teams[0].users[0].should.include(user);
              done();
            });
        });
      });
    });
  });
  describe("teamByID query", () => {
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
            .post("/graphql")
            .send({
              query: `{teamByID(uuid:"${uuid}"){uuid name logo users{uuid pseudo score TeamUuid}}}`
            })
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              const body = res.body;
              body.should.be.a("object");
              body.data.should.be.a("object");
              body.data.teamByID.should.be.a("object");
              body.data.teamByID.should.have.keys(
                "uuid",
                "name",
                "users",
                "logo"
              );
              body.data.teamByID.users.length.should.be.eql(1);
              body.data.teamByID.users.should.be.a("array");
              body.data.teamByID.users[0].should.have.keys(
                "uuid",
                "pseudo",
                "score",
                "TeamUuid"
              );
              body.data.teamByID.users[0].should.include(user);
              done();
            });
        });
      });
    });
  });

  // USERS QUERIES
  describe("users query", () => {
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
            .post("/graphql")
            .send({ query: `{users{uuid pseudo score TeamUuid}}` })
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
  });
  describe("userByID query", () => {
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
            .post("/graphql")
            .send({
              query: `{userByID(uuid:"${createdUser.uuid}"){uuid pseudo score TeamUuid}}`
            })
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              const body = res.body;
              body.should.be.a("object");
              body.data.should.be.a("object");
              body.data.userByID.should.be.a("object");
              body.data.userByID.should.have.keys(
                "uuid",
                "pseudo",
                "score",
                "TeamUuid"
              );
              body.data.userByID.should.include(userSample);
              done();
            });
        });
      });
    });
  });

  // TEAMS MUTATIONS
  // TODO: Write team mutation tests

  // USERS MUTATIONS

  describe("createUser mutation", () => {
    it("should create a new user", done => {
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        chai
          .request(server)
          .post("/graphql")
          .send({
            query: `mutation createUser{ createUser(userInput: {pseudo: "Jane Doe", team:"${uuid}"}){uuid pseudo score TeamUuid}}`
          })
          .end((err, res) => {
            if (err) return done(err);
            res.should.have.status(200);
            const body = res.body;
            body.data.should.be.a("object");
            body.data.createUser.should.be.a("object");
            body.data.createUser.should.have.keys(
              "uuid",
              "pseudo",
              "score",
              "TeamUuid"
            );
            body.data.createUser.should.include({ pseudo: "Jane Doe" });
            done();
          });
      });
    });
  });
  describe("userClick mutation", () => {
    it("should create a new user", done => {
      Team.create(teamSample).then(createdTeam => {
        const { uuid } = createdTeam;
        const user = {
          ...userSample,
          TeamUuid: uuid
        };
        User.create(user).then(createdUser => {
          chai
            .request(server)
            .post("/graphql")
            .send({
              query: `mutation userClick{ userClick(uuid: "${createdUser.uuid}"){uuid pseudo score TeamUuid}}`
            })
            .end((err, res) => {
              if (err) return done(err);
              res.should.have.status(200);
              const body = res.body;
              body.data.should.be.a("object");
              body.data.userClick.should.be.a("object");
              body.data.userClick.should.have.keys(
                "uuid",
                "pseudo",
                "score",
                "TeamUuid"
              );
              body.data.userClick.score.should.be.a("number");
              body.data.userClick.score.should.eql(1);
              body.data.userClick.should.include({ pseudo: "Jane Doe" });
              done();
            });
        });
      });
    });
  });
});
