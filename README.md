
# retrying-promise

> Create fault tolerant promises that retry upon failure according to a retry strategy.

The implementation of the retry strategies reuses code from the [node-retry][] project.


## Usage

Install `retrying-promise`:

```shell
npm install retrying-promise
```

Import `retrying-promise`:

    const retryPromise = require('retrying-promise');

The constant `retryPromise` is a function that returns a promise. Use this function similar to how you call the `new Promise()` constructor, but pass it a function that takes three instead of two functions as arguments: `resolve`, `retry` and `reject`.

    var promise = retryPromise(function (resolve, retry, reject) {

        resolve(result);  // the promise resolves normally

        retry(error);     // the promise failed and a retry may be attempted

        reject(error);    // the promise failed and no retry should be attempted

    });

Call the `resolve` function when the promise resolves normally.

Call the `retry` function when the promise failed and a retry may be attempted.

Call the `reject` function when the promise failed and no retry should be attempted.



## Test

Install [Mocha][].

```shell
sudo npm install -g mocha
```

Run tests:

```shell
npm test
```


## API Reference
**Author:** Wouter Van den Broeck  
**Copyright**: 2016  
<a name="exp_module_retrying-promise--module.exports"></a>
### module.exports([options], executor) ⇒ <code>Promise</code> ⏏
Returns a promise that conditionally tries to resolve multiple times, as specified by the retry
policy.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>retryPolicy</code> | Either An object that specifies the retry policy. |
| executor | <code>retryExecutor</code> | A function that is called for each attempt to resolve the promise. |

<a name="module_retrying-promise--module.exports..createTimeout"></a>
#### module.exports~createTimeout(attempt, opts) ⇒ <code>number</code>
Get a timeout value in milliseconds.

**Kind**: inner method of <code>[module.exports](#exp_module_retrying-promise--module.exports)</code>  
**Returns**: <code>number</code> - The timeout value in milliseconds.  

| Param | Type | Description |
| --- | --- | --- |
| attempt | <code>number</code> | The attempt count. |
| opts | <code>Object</code> | The options. |

<a name="module_retrying-promise--module.exports..retryPolicy"></a>
#### module.exports~retryPolicy : <code>Object</code>
An object that specifies the retry policy.

**Kind**: inner typedef of <code>[module.exports](#exp_module_retrying-promise--module.exports)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| retries | <code>number</code> | <code>10</code> | The maximum amount of times to retry the operation. |
| factor | <code>number</code> | <code>2</code> | The exponential factor to use. |
| minTimeout | <code>number</code> | <code>1000</code> | The number of milliseconds before starting the first retry. |
| maxTimeout | <code>number</code> | <code>Infinity</code> | The maximum number of milliseconds between two retries. |
| randomize | <code>boolean</code> | <code>false</code> | Randomizes the timeouts by multiplying with a factor between 1 to 2. |

<a name="module_retrying-promise--module.exports..retryExecutor"></a>
#### module.exports~retryExecutor : <code>function</code>
The function that is called for each attempt to resolve the promise.

**Kind**: inner typedef of <code>[module.exports](#exp_module_retrying-promise--module.exports)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resolveFn | <code>function</code> | To be called when the promise resolves normally. |
| retryFn | <code>function</code> | To be called when the promise failed and a retry may be attempted. |
| [rejectFn] | <code>function</code> | To be called when the promise failed and no retry should be attempted. |


* * *

&copy; 2016, Wouter Van den Broeck


[Mocha]: http://mochajs.org
[node-retry]: https://github.com/tim-kos/node-retry
