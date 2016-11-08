/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { describe, it, before, after, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
/* eslint-disable import/no-extraneous-dependencies */
import User from '../User';
import user from '../index';
import serv from '../../../server';

describe('Users API', () => {
  let server;
  let user1; // eslint-disable-line no-unused-vars
  let user2;
  let user3; // eslint-disable-line no-unused-vars

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

  beforeEach((done) => {
    const userData1 = { email: 'lenon@domain.com', password: '123' };
    const userData2 = { email: 'taylor@domain.com', password: '123' };
    const userData3 = { email: 'alice@domain.com', password: '123' };

    user.create(userData1)
      .then((doc) => {
        user1 = doc;
        return user.create(userData2);
      })
      .then((doc) => {
        user2 = doc;
        return user.create(userData3);
      })
      .then((doc) => {
        user3 = doc;
        done();
      })
      .catch(err => done(err));
  });

  afterEach((done) => {
    User.remove({})
      .then(() => done())
      .catch(err => done(err));
  });

  it('`create()` should create a new user', (done) => {
    const expected = {
      email: 'bart@domain.com',
      password: '123'
    };

    user.create(expected)
      .then((doc) => {
        expect({
          email: doc.email,
          password: doc.password
        }).to.deep.equal(expected);
        done();
      })
      .catch(err => done(err));
  });

  it('`all()` should list all users', (done) => {
    user.all()
      .then((docs) => {
        expect(docs).to.have.lengthOf(3);
        done();
      })
      .catch(err => done(err));
  });

  it('`find()` should find users', (done) => {
    user.find({ email: 'taylor@domain.com' })
      .then((docs) => {
        const doc = docs[0];
        expect(docs).to.have.lengthOf(1);
        expect({
          email: doc.email
        }).to.deep.equal({
          email: user2.email
        });
        done();
      })
      .catch(err => done(err));
  });

  it('`findOne()` should find one user', (done) => {
    user.findOne({ email: 'taylor@domain.com' })
      .then((doc) => {
        expect({
          _id: doc._id,
          email: doc.email,
          password: doc.password
        }).to.deep.equal({
          _id: user2._id,
          email: user2.email,
          password: user2.password
        });
        done();
      })
      .catch(err => done(err));
  });

  it('`findById()` should find one user by the ID', (done) => {
    user.findById(user2._id)
      .then((doc) => {
        expect({
          _id: doc._id,
          email: doc.email,
          password: doc.password
        }).to.deep.equal({
          _id: user2._id,
          email: user2.email,
          password: user2.password
        });
        done();
      })
      .catch(err => done(err));
  });

  it('`update()` should find one user by the ID and update it', (done) => {
    const expected = { email: 'aaa@domain.com' };

    user.update(user2._id, expected)
      .then((doc) => {
        expect({
          _id: doc._id,
          email: doc.email,
          password: doc.password
        }).to.deep.equal({
          _id: user2._id,
          email: expected.email,
          password: user2.password
        });
        done();
      })
      .catch(err => done(err));
  });

  it('`destroy()` should find one user by the ID and delete it', (done) => {
    user.destroy(user2._id)
      .then((doc) => {
        expect({
          _id: doc._id,
          email: doc.email,
          password: doc.password
        }).to.deep.equal({
          _id: user2._id,
          email: user2.email,
          password: user2.password
        });
        return user.all();
      })
      .then((docs) => {
        expect(docs).to.have.lengthOf(2);
        done();
      })
      .catch(err => done(err));
  });
});
