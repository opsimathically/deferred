import Deferred from './Deferred.class';

export default class DeferredMap {
  defer_sets: Map<any, any> = new Map<any, any>();
  public default_resolve_value: number = -987;
  public default_reject_value: number = -876;
  constructor() {}

  get size(): number {
    return this.defer_sets.size;
  }

  deferred(autotimeout_ms?: number): Deferred {
    const deferred = new Deferred({
      deferred_map_ref: this.defer_sets,
      autotimeout_ms: autotimeout_ms
    });
    this.defer_sets.set(deferred, deferred);
    return deferred;
  }

  resolveAll(resolve_value?: any) {
    if (resolve_value === undefined) resolve_value = this.default_resolve_value;
    for (const [key, value] of this.defer_sets) {
      value.resolve(this.default_resolve_value);
    }
    this.defer_sets = new Map<any, any>();
  }
  rejectAll(reject_value?: any) {
    if (reject_value === undefined) reject_value = this.default_reject_value;
    for (const [key, value] of this.defer_sets) {
      value.reject(this.default_reject_value);
    }
    this.defer_sets = new Map<any, any>();
  }
}
