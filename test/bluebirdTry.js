import assert from "assert";
import { describe, it } from "node:test";
import Bluebird from "bluebird";
import { tryPromise } from "../src/tryPromise.js";

describe("Bluebird.try vs native Promise replacement", function () {
  describe("Synchronous success cases", function () {
    it("should handle synchronous success with Bluebird.try", async () => {
      const result = await Bluebird.try(() => {
        return "success";
      });

      assert.strictEqual(result, "success");
    });

    it("should handle synchronous success with tryPromise", async () => {
      const result = await tryPromise(() => {
        return "success";
      });

      assert.strictEqual(result, "success");
    });
  });

  describe("Synchronous error cases", function () {
    it("should handle synchronous errors with Bluebird.try", async () => {
      try {
        await Bluebird.try(() => {
          throw new Error("sync error");
        });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(err.message, "sync error");
      }
    });

    it("should handle synchronous errors with tryPromise", async () => {
      try {
        await tryPromise(() => {
          throw new Error("sync error");
        });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(err.message, "sync error");
      }
    });
  });

  describe("Asynchronous success cases", function () {
    it("should handle async success with Bluebird.try", async () => {
      const result = await Bluebird.try(() => {
        return Promise.resolve("async success");
      });

      assert.strictEqual(result, "async success");
    });

    it("should handle async success with tryPromise", async () => {
      const result = await tryPromise(() => {
        return Promise.resolve("async success");
      });

      assert.strictEqual(result, "async success");
    });
  });

  describe("Asynchronous error cases", function () {
    it("should handle async errors with Bluebird.try", async () => {
      try {
        await Bluebird.try(() => {
          return Promise.reject(new Error("async error"));
        });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(err.message, "async error");
      }
    });

    it("should handle async errors with tryPromise", async () => {
      try {
        await tryPromise(() => {
          return Promise.reject(new Error("async error"));
        });
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(err.message, "async error");
      }
    });
  });

  describe("Complex example", function () {
    const params = {
      defaultValue: null,
      foo: {
        getBar: () => 42,
        createBaz: ({ option1, option2 }) => {
          return Promise.resolve({ result: `generated-${option1}-${option2}` });
        },
      },
    };

    it("should handle complex example with Bluebird.try", async () => {
      const collection = [];
      const someValue = 100;

      // Mock function to simulate the original example
      const processCollection = () => "processed";

      const output = await Bluebird.try(function () {
        if (params.defaultValue) {
          // If default value exists, use it
          return params.defaultValue;
        } else {
          // Otherwise create a new value
          const barValue = params.foo.getBar(params);
          return params.foo
            .createBaz({ option1: barValue, option2: true })
            .then(function (result) {
              return result.result;
            });
        }
      }).then(function (value) {
        collection.push({ value: value, amount: someValue });
        return processCollection();
      });

      assert.strictEqual(output, "processed");
      assert.deepStrictEqual(collection, [
        { value: "generated-42-true", amount: 100 },
      ]);
    });

    it("should handle complex example with tryPromise", async () => {
      const collection = [];
      const someValue = 100;

      // Mock function to simulate the original example
      const processCollection = () => "processed";

      const output = await tryPromise(function () {
        if (params.defaultValue) {
          // If default value exists, use it
          return params.defaultValue;
        } else {
          // Otherwise create a new value
          const barValue = params.foo.getBar(params);
          return params.foo
            .createBaz({ option1: barValue, option2: true })
            .then(function (result) {
              return result.result;
            });
        }
      }).then(function (value) {
        collection.push({ value: value, amount: someValue });
        return processCollection();
      });

      assert.strictEqual(output, "processed");
      assert.deepStrictEqual(collection, [
        { value: "generated-42-true", amount: 100 },
      ]);
    });
  });

  describe("Edge cases", function () {
    it("should handle non-function arguments with Bluebird.try", async () => {
      try {
        await Bluebird.try("not a function");
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err instanceof TypeError);
      }
    });

    it("should handle non-function arguments with tryPromise", async () => {
      try {
        await tryPromise("not a function");
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.ok(err instanceof TypeError);
      }
    });

    it("should provide correct error message for non-function arguments", async () => {
      try {
        await tryPromise("not a function");
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(
          err.message,
          "Expected a function but got [object String]"
        );
      }

      try {
        await tryPromise(null);
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(
          err.message,
          "Expected a function but got [object Null]"
        );
      }

      try {
        await tryPromise({});
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(
          err.message,
          "Expected a function but got [object Object]"
        );
      }

      try {
        await tryPromise(123);
        assert.fail("Should have thrown an error");
      } catch (err) {
        assert.strictEqual(
          err.message,
          "Expected a function but got [object Number]"
        );
      }
    });

    it("should handle undefined return with Bluebird.try", async () => {
      const result = await Bluebird.try(() => {
        // No return statement
      });

      assert.strictEqual(result, undefined);
    });

    it("should handle undefined return with tryPromise", async () => {
      const result = await tryPromise(() => {
        // No return statement
      });

      assert.strictEqual(result, undefined);
    });
  });
});
