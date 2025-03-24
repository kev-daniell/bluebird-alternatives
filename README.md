# Bluebird Alternatives

This repository provides native Promise-based alternatives to commonly used Bluebird Promise library methods. These implementations allow you to remove the Bluebird dependency while maintaining the same functionality.

## Implemented Alternatives

### 1. `nodeify` Alternative

Bluebird's `nodeify` method converts a Promise to a callback-style function. The native Promise alternative uses a combination of `.then()` and `.catch()`:

**Bluebird version:**

```javascript
somePromise.nodeify(callback);
```

**Native Promise alternative:**

```javascript
somePromise.then(callback).catch(callback);
```

### 2. `try` Alternative

Bluebird's `try` method safely executes a function and returns a Promise. The native Promise alternative is implemented in this repository:

**Bluebird version:**

```javascript
Bluebird.try(() => {
  // code that might throw or return a promise
  return someValue;
});
```

**Native Promise alternative:**

```javascript
function tryPromise(fn) {
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
```

## Usage

Import the functions you need:

```javascript
import { tryPromise } from "./src/tryPromise.js";

// Use the function

tryPromise(() => {
  // Your async code here
});
```

## Benefits

- **Reduced Dependencies**: Remove Bluebird as a dependency to reduce package size

- **Modern JavaScript**: Use native Promise features available in modern JavaScript

- **Simplified Codebase**: Transition away from third-party Promise libraries

- **Improved Performance**: Native Promises are well-optimized in modern JavaScript engines

## Testing

The repository includes comprehensive tests comparing the behavior of Bluebird methods with their native Promise alternatives to ensure compatibility.

To run tests:

```
npm run test
```
