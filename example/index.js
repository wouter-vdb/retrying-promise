'use strict';

const retryingPromise = require('../lib/index');

console.log(Promise.resolve(123).then((v) => console.log(v)));

Promise.resolve()
  .then(() => {
    console.log('# Simply resolve:');
    return retryingPromise((resolve) => resolve('ok'));
  })
  .then(result => {
    console.log('  - result:', result);
  })
  .then(() => {
    console.log('# Simply reject:');
    return retryingPromise((resolve, retry, reject) => reject('nok'));
  })
  .catch(error => {
    console.log('  - err:', error);
  })
  .then(() => {
    console.log('# Resolve on third attempt:');
    var attempts = 0;
    return retryingPromise({minTimeout: 250, factor: 1}, (resolve, retry, reject) => {
      attempts++;
      console.log('  - attempts:', attempts);
      if (attempts == 3) {
        resolve(123);
      }
      else {
        retry();
      }
    });
  })
  .then(result => {
    console.log('  - result:', result)
  })
  .then(() => {
    console.log('# Reject after 3 attempts:');
    var attempts = 0;
    return retryingPromise({retries: 3, minTimeout: 250, factor: 1}, (resolve, retry, reject) => {
      attempts++;
      console.log('  - attempts:', attempts);
      retry('nok');
    });
  })
  .catch(error => {
    console.log('  - err:', error)
  });
