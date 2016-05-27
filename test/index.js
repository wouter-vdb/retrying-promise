const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

const retryingPromise = require('../lib/index');

const should = chai.should();
chai.use(chaiAsPromised);

describe('retrying-promise', () => {

  describe('resolve', () => {
    it('should simply resolve', () => {
      return retryingPromise((resolve, retry, reject) => {
        setTimeout(() => resolve('ok'), 250);
      }).should.eventually.equal('ok');
    })
  });

  describe('resolve', () => {
    it('should resolve on third attempt', (done) => {
      var retries = 0;
      retryingPromise({minTimeout: 200, factor: 1}, (resolve, retry, reject) => {
        retries++;
        if (retries == 3) {
          resolve('ok');
        }
        else {
          retry('nok');
        }
      }).then(
        (result) => {
          result.should.equal('ok');
          retries.should.equal(3);
          done();
        },
        (err) => {
          throw new Error('rejected');
        }
      );
    });
  });

  describe('reject', () => {
    it('should simply reject', () => {
      return retryingPromise((resolve, retry, reject) => {
        setTimeout(() => reject('nok'), 250);
      }).should.eventually.rejectedWith('nok');
    })
  });

  describe('retries', () => {
    it('should do three retries and then reject', (done) => {
      var retries = 0;
      retryingPromise({retries: 3, minTimeout: 200, factor: 1}, (resolve, retry, reject) => {
        retries++;
        retry('nok');
      }).then(
        (result) => {
          throw new Error('resolved');
        },
        (err) => {
          err.should.equal('nok');
          retries.should.equal(3);
          done();
        }
      );
    });
  });

});
