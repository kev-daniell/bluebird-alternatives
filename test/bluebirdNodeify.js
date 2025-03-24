import assert from "assert";
import { describe, it } from "node:test";
import Bluebird from "bluebird";

describe("Bluebird nodeify vs Promise then/catch pattern", function () {
  // Mock object to simulate a client
  const mockClient = {
    get: function (url) {
      return {
        result: function () {
          // Simulate successful API call
          return Promise.resolve({ items: ["item1", "item2"] });
        },
      };
    },
  };

  // Mock object that will throw an error
  const mockClientError = {
    get: function (url) {
      return {
        result: function () {
          // Simulate failed API call
          return Promise.reject(new Error("API Error"));
        },
      };
    },
  };

  describe("Success case", function () {
    it("should handle success with Bluebird nodeify", async () => {
      const context = { client: mockClient };
      const url = "/api/v1/resource/123/items";
      
      return new Promise((resolve, reject) => {
        function callback(err, items) {
          try {
            assert.strictEqual(err, null);
            assert.deepStrictEqual(items, ["item1", "item2"]);
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Bluebird's nodeify
        Bluebird.resolve(context.client.get(url).result())
          .then(function (body) {
            return body.items;
          })
          .nodeify(callback);
      });
    });

    it("should handle success with Promise then/catch pattern", async () => {
      const context = { client: mockClient };
      const url = "/api/v1/resource/123/items";
      
      return new Promise((resolve, reject) => {
        function callback(err, items) {
          try {
            assert.strictEqual(err, null);
            assert.deepStrictEqual(items, ["item1", "item2"]);
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Promise then/catch pattern
        Promise.resolve(context.client.get(url).result())
          .then(function (body) {
            return body.items;
          })
          .then((result) => callback(null, result))
          .catch(callback);
      });
    });
  });

  describe("Error case", function () {
    it("should handle errors with Bluebird nodeify", async () => {
      const context = { client: mockClientError };
      const url = "/api/v1/resource/123/items";
      
      return new Promise((resolve, reject) => {
        function callback(err, items) {
          try {
            assert.strictEqual(err instanceof Error, true);
            assert.strictEqual(err.message, "API Error");
            assert.strictEqual(items, undefined);
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Bluebird's nodeify
        Bluebird.resolve(context.client.get(url).result())
          .then(function (body) {
            return body.items;
          })
          .nodeify(callback);
      });
    });

    it("should handle errors with Promise then/catch pattern", async () => {
      const context = { client: mockClientError };
      const url = "/api/v1/resource/123/items";
      
      return new Promise((resolve, reject) => {
        function callback(err, items) {
          try {
            assert.strictEqual(err instanceof Error, true);
            assert.strictEqual(err.message, "API Error");
            assert.strictEqual(items, undefined);
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Promise then/catch pattern
        Promise.resolve(context.client.get(url).result())
          .then(function (body) {
            return body.items;
          })
          .then((result) => callback(null, result))
          .catch(callback);
      });
    });
  });

  describe("Timeout simulation", function () {
    it("should handle async operations with Bluebird nodeify", async () => {
      function simulateAsyncOperation() {
        return new Bluebird((resolve) => {
          setTimeout(() => {
            resolve({ data: "async result" });
          }, 50);
        });
      }

      return new Promise((resolve, reject) => {
        function callback(err, result) {
          try {
            assert.strictEqual(err, null);
            assert.deepStrictEqual(result, { data: "async result" });
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Bluebird's nodeify
        simulateAsyncOperation().nodeify(callback);
      });
    });

    it("should handle async operations with Promise then/catch pattern", async () => {
      function simulateAsyncOperation() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: "async result" });
          }, 50);
        });
      }

      return new Promise((resolve, reject) => {
        function callback(err, result) {
          try {
            assert.strictEqual(err, null);
            assert.deepStrictEqual(result, { data: "async result" });
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Promise then/catch pattern
        simulateAsyncOperation()
          .then((result) => callback(null, result))
          .catch(callback);
      });
    });

    it("should handle async errors with Bluebird nodeify", async () => {
      function simulateAsyncError() {
        return new Bluebird((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("async error"));
          }, 50);
        });
      }

      return new Promise((resolve, reject) => {
        function callback(err, result) {
          try {
            assert.strictEqual(err instanceof Error, true);
            assert.strictEqual(err.message, "async error");
            assert.strictEqual(result, undefined);
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Bluebird's nodeify
        simulateAsyncError().nodeify(callback);
      });
    });

    it("should handle async errors with Promise then/catch pattern", async () => {
      function simulateAsyncError() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("async error"));
          }, 50);
        });
      }

      return new Promise((resolve, reject) => {
        function callback(err, result) {
          try {
            assert.strictEqual(err instanceof Error, true);
            assert.strictEqual(err.message, "async error");
            assert.strictEqual(result, undefined);
            resolve();
          } catch (e) {
            reject(e);
          }
        }

        // Using Promise then/catch pattern
        simulateAsyncError()
          .then((result) => callback(null, result))
          .catch(callback);
      });
    });
  });
});
