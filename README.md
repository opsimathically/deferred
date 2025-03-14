# deferred

Utility classes for working with the asynchronous deferral pattern. Primarily used in conjunction
with asynchronous/callback oriented code that doesn't match promisify callback signatures. It's
generally useful for working with arbitrary unusual callback based apis. The Deferred class is
a standalone promise/resolve/reject set, whereas the DeferredMap lets you create a map containing
an arbitrarily created number of deferrals. The advantage of using the map version is that you
can easily track and resolve/reject all waiting deferrals when desired rather than having to
track them all individually.

# Install

npm install @opsimathically/deferred

# Usage

```typescript
import { Deferred, DeferredMap } from '@opsimathically/deferred';

(async function () {
  // create new deferral map
  const deferred_map = new DeferredMap();

  // create and track a single deferral
  const deferral: Deferred = deferred_map.deferred();

  // wait 500ms before resolving the deferral
  setTimeout(function () {
    deferral.resolve(true);
  }, 500);

  // after the timeout, this promise will resolve with the desired result (true)
  let deferred_result = await deferral.promise;
  console.log(`deferred_result after 500ms wait: ${deferred_result}`);

  // create 500 deferrals
  for (let idx = 0; idx < 500; idx++) deferred_map.deferred();

  // resolve all promises with value (true)
  console.log(
    `Total entries in map before resolving them: ${deferred_map.size}`
  );
  deferred_map.resolveAll(true);
  console.log(
    `Total entries in map after resolving them: ${deferred_map.size}`
  );
})();
```
