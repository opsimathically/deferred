import test from 'node:test';
import assert from 'node:assert';
import Deferred from '@src/Deferred.class';
import DeferredMap from '@src/DeferredMap.class';

(async function () {
  test('Create and resolve a deferral map and instance.', async function () {
    const deferred_map = new DeferredMap();
    const deferral: Deferred = deferred_map.deferred();
    if (deferred_map.size !== 1) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 1`
      );
    }
    deferral.resolve(true);
    if (deferred_map.size !== 0) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 0`
      );
    }
  });

  test('Create and reject a deferral map and instance.', async function () {
    const deferred_map = new DeferredMap();
    const deferral: Deferred = deferred_map.deferred();
    if (deferred_map.size !== 1) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 1`
      );
    }
    deferral.promise.catch(function () {
      console.log('Rejected ok!');
    });
    deferral.reject('Rejecting promise here.');
    if (deferred_map.size !== 0) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 0`
      );
    }
  });

  test('Create a deferral map and deferral instance with a timeout and wait for resolution', async function () {
    const deferred_map = new DeferredMap();
    const deferral: Deferred = deferred_map.deferred(500);
    if (deferred_map.size !== 1) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 1`
      );
    }
    await deferral.promise;
    if (deferred_map.size !== 0) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 0`
      );
    }
  });

  test('Create 100 deferrals and resolve them all', async function () {
    const deferred_map = new DeferredMap();
    for (let idx = 0; idx < 100; idx++) deferred_map.deferred();
    if (deferred_map.size !== 100) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 1`
      );
    }
    deferred_map.resolveAll();
    if (deferred_map.size !== 0) {
      assert.fail(
        `Map size of ${deferred_map.size} does not match expected size of 0`
      );
    }
  });

  test('Readme usage code', async function () {
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

    // resolve all promises with value true
    console.log(
      `Total entries in map before resolving them: ${deferred_map.size}`
    );
    deferred_map.resolveAll(true);
    console.log(
      `Total entries in map after resolving them: ${deferred_map.size}`
    );
  });
})();
