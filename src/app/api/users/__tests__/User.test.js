/* eslint-disable import/no-extraneous-dependencies */
import { describe, it } from 'mocha';
import { expect } from 'chai';
/* eslint-disable import/no-extraneous-dependencies */
import User from '../User';

describe('User model', () => {
  it('should be called `User`', () => {
    expect(User.modelName).to.equal('User');
  });

  describe('User schema', () => {
    const { paths } = User.schema;

    describe('`email` field', () => {
      const { instance, options } = paths.email;

      it('should be `String`', () => {
        expect(instance).to.equal('String');
      });

      it('should be `required`', () => {
        expect(options.required).to.equal(true);
      });

      it('should be `unique`', () => {
        expect(options.unique).to.equal(true);
      });
    });

    describe('`password` field', () => {
      const { instance, options } = paths.password;

      it('should be `String`', () => {
        expect(instance).to.equal('String');
      });

      it('should be `required`', () => {
        expect(options.required).to.equal(true);
      });
    });

    describe('`createdAt` field', () => {
      const { instance, options } = paths.createdAt;

      it('should be `Date`', () => {
        expect(instance).to.equal('Date');
      });

      it('should have a default date', () => {
        const now = options.default;
        expect(options).to.have.property('default');
        expect(now).to.be.instanceOf(Function);
        expect(now()).not.to.be.NaN; // eslint-disable-line no-unused-expressions
      });
    });
  });
});
