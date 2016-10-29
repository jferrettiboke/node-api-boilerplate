import { describe, it, before, after, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
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
        throw new Error(err)
      });
  });

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
          done();
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
          done();
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
          done();
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
          expect(token).to.not.be.null;
          expect(token).to.be.a('string');
          expect(errors).to.be.empty;
          done();
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
          done();
        });
    });
  });

});
