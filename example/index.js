'use strict';

const retryPromise = require('../lib/index');

console.log(Promise.resolve(123).then((v) => console.log(v)));

Promise.resolve().then(function () {
    console.log('# Simply resolve:');
    return retryPromise((resolve) => resolve('ok'));
}).then((result) => {
    console.log('  - result:', result);
}).then(() => {
    console.log('# Simply reject:');
    return retryPromise((resolve, retry, reject) => reject('nok'));
}).catch((err) => {
    console.log('  - err:', err);
}).then(() => {
    console.log('# Resolve on third attempt:');
    var attempts = 0;
    return retryPromise({ minTimeout: 250, factor: 1 }, (resolve, retry, reject) => {
        attempts++;
        console.log('  - attempts:', attempts);
        if (attempts == 3) { resolve(123); }
        else { retry(); }
    });
}).then((result) => {
    console.log('  - result:', result)
}).then(() => {
    console.log('# Reject after 3 attempts:');
    var attempts = 0;
    return retryPromise({retries: 3, minTimeout: 250, factor: 1 }, (resolve, retry, reject) => {
        attempts++;
        console.log('  - attempts:', attempts);
        retry('nok');
    });
}).catch((err) => {
    console.log('  - err:', err)
});





