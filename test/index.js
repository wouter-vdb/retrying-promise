const chai           = require('chai');
const chaiAsPromised = require("chai-as-promised");
//const sinon          = require('sinon');

const retryPromise   = require('../lib/index');

const should = chai.should();
chai.use(chaiAsPromised);


describe('retrying-promise', function () {

    describe('resolve', function () {
        it('should simply resolve', function () {
            return retryPromise(function (resolve) {
                setTimeout(() => resolve('ok'), 250);
            }).should.eventually.equal('ok');
        })
    });

    describe('resolve', function () {
        it('should resolve on third attempt', function (done) {
            var retries = 0;
            retryPromise({ minTimeout: 200, factor: 1 }, function (resolve, retry) {
                retries++;
                if (retries == 3) { resolve('ok'); }
                else { retry('nok'); }
            }).then(
                (result) => {
                    result.should.equal('ok');
                    retries.should.equal(3);
                    done();
                },
                (err) => { throw new Error('rejected'); }
            );
        });
    });

    describe('reject', function () {
        it('should simply reject', function () {
            return retryPromise(function (resolve, retry, reject) {
                setTimeout(() => reject('nok'), 250);
            }).should.eventually.rejectedWith('nok');
        })
    });

    describe('3 retries', function () {
        it('should do three retries and then reject', function (done) {
            var retries = 0;
            retryPromise({ retries: 3, minTimeout: 200, factor: 1 }, function (resolve, retry) {
                retries++;
                retry('nok');
            }).then(
                (result) => { throw new Error('resolved'); },
                (err) => {
                    err.should.equal('nok');
                    retries.should.equal(3);
                    done();
                }
            );
        });
    });

});
