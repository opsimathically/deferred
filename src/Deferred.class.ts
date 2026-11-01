export default class Deferred<T = any, E = string> {
    public promise: Promise<T>;
    public already_completed: boolean = false;
    public resolve_real!: (value: T | PromiseLike<T>) => void;
    public reject_real!: (reason?: E) => void;
    private timeout: NodeJS.Timeout | null = null;
    private deferred_map_ref: Map<any, any> | null = null;
    constructor(params?: {
      deferred_map_ref: Map<any, any>;
      autotimeout_ms?: number;
    }) {
      const defer_ref = this;
      this.promise = new Promise<T>((resolve, reject) => {
        defer_ref.resolve_real = resolve;
        defer_ref.reject_real = reject;
      });
      if (params) {
        if (typeof params.autotimeout_ms === 'number') {
          defer_ref.timeout = setTimeout(
            (param) => {
              param.resolve(null as T);
            },
            params.autotimeout_ms,
            this
          );
        }
  
        if (params.deferred_map_ref) {
          defer_ref.deferred_map_ref = params.deferred_map_ref;
          defer_ref.deferred_map_ref.set(defer_ref, defer_ref);
        }
      }
    }
    resolve(val: T) {
      if (this.already_completed) return;
      this.already_completed = true;
      if (this.timeout) clearTimeout(this.timeout);
      this.resolve_real(val);
      this.deferred_map_ref?.delete(this);
    }
    reject(val: E) {
      if (this.already_completed) return;
      this.already_completed = true;
      if (this.timeout) clearTimeout(this.timeout);
      this.reject_real(val);
      this.deferred_map_ref?.delete(this);
    }
  }
  