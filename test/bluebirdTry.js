import assert from "assert";
import { describe, it } from "node:test";
import { tryPromise } from "../src/tryPromise.js";

/**
 * These tests are based on the Bluebird try.js tests:
 * https://github.com/petkaantonov/bluebird/blob/master/test/mocha/try.js
 * 
 * They have been adapted to use tryPromise instead of Bluebird.try
 */

const obj = {};
const error = new Error();
const thrower = function() {
  throw error;
};

const identity = function(val) {
  return val;
};

const array = function() {
  return Array.from(arguments);
};

const receiver = function() {
  return this;
};

describe("tryPromise", function() {
  it("should reject when the function throws", function() {
    let async = false;
    const ret = tryPromise(thrower).then(
      () => assert.fail("Should not fulfill"),
      (e) => {
        assert(async);
        assert(e === error);
      }
    );
    async = true;
    return ret;
  });

  it("should reject when the function is not a function", function() {
    let async = false;
    const ret = tryPromise(null).then(
      () => assert.fail("Should not fulfill"),
      (e) => {
        assert(async);
        assert(e instanceof TypeError);
      }
    );
    async = true;
    return ret;
  });

  it("should unwrap returned promise", function() {
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });

    const ret = tryPromise(() => {
      return promise;
    }).then((v) => {
      assert.strictEqual(v, 3);
    });

    setTimeout(() => {
      resolve(3);
    }, 1);
    
    return ret;
  });
  
  it("should unwrap returned thenable", function() {
    return tryPromise(() => {
      return {
        then: function(f) {
          f(3);
        }
      };
    }).then((v) => {
      assert.strictEqual(v, 3);
    });
  });
});
