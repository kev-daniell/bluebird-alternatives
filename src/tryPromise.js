/**
 * A native Promise-based replacement for Bluebird.try
 *
 * This function executes the provided function and returns a Promise.
 * If the function throws synchronously, the exception is caught and returned as a rejected Promise.
 * If the function returns a Promise, that Promise is returned.
 * If the function returns any other value, a resolved Promise with that value is returned.
 *
 * @param {Function} fn - The function to execute
 * @returns {Promise} A promise that resolves with the return value of fn or rejects with any error thrown
 */
export function tryPromise(fn) {
  if (typeof fn !== "function") {
    return Promise.reject(
      new TypeError(
        `Expected a function but got ${Object.prototype.toString.call(fn)}`
      )
    );
  }

  try {
    const result = fn();
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}
