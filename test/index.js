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
    });
  });

  describe('resolve', () => {
    it('should resolve on third attempt', done => {
      var trial = 0;
      retryingPromise({minTimeout: 200, factor: 1}, (resolve, retry, reject) => {
        trial++;
        if (trial == 3) { resolve('ok'); }
        else { retry('nok'); }
      })
        .then(result => {
          result.should.equal('ok');
          trial.should.equal(3);
          done();
        })
        .catch(error => { throw new Error('should not be rejected'); });
    });
  });

  describe('reject', () => {
    it('should simply reject', () => {
      return retryingPromise((resolve, retry, reject) => {
        setTimeout(() => reject('nok'), 250);
      }).should.eventually.rejectedWith('nok');
    });
  });

  describe('retries', () => {
    it('should do three retries and then reject', done => {
      var trial = 0;
      retryingPromise({retries: 3, minTimeout: 200, factor: 1}, (resolve, retry, reject) => {
        trial++;
        retry('nok');
      })
        .then(result => {
          throw new Error('should not resolve');
        })
        .catch(error => {
          error.should.equal('nok');
          trial.should.equal(3);
          done();
        });
    });
  });

  describe('retries', () => {
    it('should not allow multiple retries in one cycle', done => {
      var trial = 0;
      retryingPromise({retries: 3, minTimeout: 200, factor: 1}, (resolve, retry, reject) => {
        trial++;
        if (trial == 1) {
          retry('this retry should be accepted');
          retry('this retry should be ignored');
        }
        else if (trial == 2) {
          resolve('ok');
        }
        else {
          throw new Error('should not retry more than once');
        }
      })
        .then(result => {
          result.should.equal('ok');
          trial.should.equal(2);
          done();
        })
        .catch(error => {
          throw new Error('should not be rejected');
        });
    });
  });

});
