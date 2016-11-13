/* eslint-disable import/no-extraneous-dependencies */
import { describe, it } from 'mocha';
import { expect } from 'chai';
/* eslint-disable import/no-extraneous-dependencies */
import { view } from '../index';

describe('View module', () => {
  it('renders a raw string', (done) => {
    const str = view('Hello {{ username }}', { username: 'John' });
    expect(str).to.equal('Hello John');
    return done();
  });

  it('renders a file', (done) => {
    const options = { path: 'src/modules/View/__tests__' };
    const str = view('index.html', { username: 'John' }, options);
    expect(str).to.equal('Hello John\r\n');
    return done();
  });
});
