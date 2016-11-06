/* eslint-disable import/no-extraneous-dependencies */
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
/* eslint-disable import/no-extraneous-dependencies */
import serv from '../src/app/server';
import User from '../src/app/api/users/User';

describe('Graph API', () => {
  let server;

  before((done) => {
    server = serv;
    done();
  });

  after((done) => {
    User.remove({}).exec()
      .then(() => {
        server.close();
        done();
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  describe('mutation', () => {
    describe('signUp', () => {
      it('returns an error when email is empty', (done) => {
        const query = `
          mutation {
            signUp(email: "", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'email.empty', value: 'Email is empty.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when email is invalid', (done) => {
        const query = `
          mutation {
            signUp(email: "johndomain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'email.invalid', value: 'You have to provide a valid email.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when password is empty', (done) => {
        const query = `
          mutation {
            signUp(email: "john@domain.com", password: "") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'password.empty', value: 'You have to provide a password.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns a user token after create the user with no errors', (done) => {
        const query = `
          mutation {
            signUp(email: "john@domain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            const obj = JSON.parse(res.text);
            const { token, errors } = obj.data.signUp;
            expect(token).to.not.be.null; // eslint-disable-line no-unused-expressions
            expect(token).to.be.a('string');
            expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
            return done();
          });
      });

      it('returns an error when user already exists', (done) => {
        const query = `
          mutation {
            signUp(email: "john@domain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signUp: {
                  token: null,
                  errors: [{ key: 'user.exists', value: 'There is already a user with this email.' }]
                }
              }
            });
            return done();
          });
      });
    });

    describe('signIn', () => {
      it('returns an error when email is empty', (done) => {
        const query = `
          mutation {
            signIn(email: "", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'email.empty', value: 'Email is empty.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when email is invalid', (done) => {
        const query = `
          mutation {
            signIn(email: "johndomain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'email.invalid', value: 'You have to provide a valid email.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when password is empty', (done) => {
        const query = `
          mutation {
            signIn(email: "john@domain.com", password: "") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'password.empty', value: 'You have to provide a password.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when the user does not exist', (done) => {
        const query = `
          mutation {
            signIn(email: "johnnn@domain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'user.not_found', value: 'Authentication failed. User not found.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns an error when the password is wrong', (done) => {
        const query = `
          mutation {
            signIn(email: "john@domain.com", password: "abc") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            expect(JSON.parse(res.text)).to.deep.equal({
              data: {
                signIn: {
                  token: null,
                  errors: [{ key: 'password.wrong', value: 'Wrong password.' }]
                }
              }
            });
            return done();
          });
      });

      it('returns a user token after log in the user with no errors', (done) => {
        const query = `
          mutation {
            signIn(email: "john@domain.com", password: "123") {
              token
              errors {
                key
                value
              }
            }
          }
        `;

        request(server)
          .post('/graphql')
          .send({ query })
          .end((err, res) => {
            if (err) { return done(err); }
            const obj = JSON.parse(res.text);
            const { token, errors } = obj.data.signIn;
            expect(token).to.not.be.null; // eslint-disable-line no-unused-expressions
            expect(token).to.be.a('string');
            expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
            return done();
          });
      });
    });
  });
});
