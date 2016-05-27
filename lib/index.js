"use strict";

/**
 * @author Wouter Van den Broeck
 * @copyright ©2016, Wouter Van den Broeck
 */

/**
 * An object that specifies the retry policy.
 * @typedef {Object} retryPolicy
 * @property {number} [retries = 10] - The maximum amount of times to retry the operation.
 * @property {number} [factor = 2] - The exponential factor to use.
 * @property {number} [minTimeout = 1000] - The number of milliseconds before starting the first retry.
 * @property {number} [maxTimeout = Infinity] - The maximum number of milliseconds between two retries.
 * @property {boolean} [randomize = false] - Randomizes the timeouts by multiplying with a factor between 1 to 2.
 */

/**
 * The function that is called for each attempt to resolve the promise.
 * @callback retryExecutor
 * @param {function} resolveFn - To be called when the promise resolves normally.
 * @param {function} retryFn - To be called when the promise failed and a retry may be attempted.
 * @param {function} [rejectFn] - To be called when the promise failed and no retry should be attempted.
 */

/**
 * Returns a promise that conditionally tries to resolve multiple times, as specified by the retry
 * policy.
 * @param {retryPolicy} [options] - Either An object that specifies the retry policy.
 * @param {retryExecutor} executor - A function that is called for each attempt to resolve the promise.
 * @returns {Promise}
 */
function retryPromise(options, executor) {
  if (executor == undefined) {
    executor = options;
    options = {};
  }

  var opts = prepOpts(options);
  var attempts = 1;

  return new Promise((resolve, reject) => {
    let retrying = false;

    function retry(err) {
      if (retrying) return;
      retrying = true;
      if (attempts < opts.retries) {
        setTimeout(() => {
          attempts++;
          retrying = false;
          executor(resolve, retry, reject);
        }, createTimeout(attempts, opts));
      }
      else {
        //console.log(attempts, opts.retries);
        reject(err);
      }
    }

    executor(resolve, retry, reject);
  });
}

/*
 * Preps the options object, initializing default values and checking constraints.
 * @param {Object} options - The options as provided to `retryingPromise`.
 */
function prepOpts(options) {
  var opts = {
    retries: 10,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: Infinity,
    randomize: false
  };
  for (var key in options) {
    opts[key] = options[key];
  }

  if (opts.minTimeout > opts.maxTimeout) {
    throw new Error('minTimeout is greater than maxTimeout');
  }

  return opts;
}

/**
 * Get a timeout value in milliseconds.
 * @param {number} attempt - The attempt count.
 * @param {Object} opts - The options.
 * @returns {number} The timeout value in milliseconds.
 */
function createTimeout(attempt, opts) {
  var random = opts.randomize ? Math.random() + 1 : 1;

  var timeout = Math.round(random * opts.minTimeout * Math.pow(opts.factor, attempt));
  timeout = Math.min(timeout, opts.maxTimeout);

  return timeout;
}

module.exports = retryPromise;
