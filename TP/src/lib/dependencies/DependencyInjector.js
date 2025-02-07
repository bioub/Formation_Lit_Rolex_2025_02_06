/**
 * @typedef {string | symbol} Key
 * @typedef {import('./DependencyInjector.d.ts').DependencyInjector<any>} IDependencyInjector
 */

/**
 * @export
 * @class DependencyInjector
 * @extends {EventTarget}
 * @implements {IDependencyInjector}
 */
export class DependencyInjector extends EventTarget {
  dependencies = new Map();

  provide(key, value, { override = false } = {}) {
    if (this.dependencies.has(key) && override === false) {
      return this.dependencies.get(key);
    }

    if (typeof value === "function") {
      value = value();
    }

    this.dependencies.set(key, value);

    this.dispatchEvent(
      new CustomEvent("provide-dependency", { detail: value }),
    );

    return value;
  }

  inject(key, { throwUnknown = false } = {}) {
    // copy reference for the proxy scope
    const dependencies = this.dependencies;

    const handler = {
      get(_target, prop, _receiver) {
        if (dependencies.has(key) === false) {
          if (throwUnknown === false) {
            return undefined;
          }

          if (typeof key === "symbol") {
            throw new Error(
              "Missing dependency with symbol: " + key.description,
            );
          }

          throw new Error("Missing dependency with key: " + key);
        }

        const dependency = dependencies.get(key);
        const value = Reflect.get(dependency, prop, dependency);

        return typeof value === "function" ? value.bind(dependency) : value;
      },
      set(_target, propertyKey, value, _receiver) {
        const dependency = dependencies.get(key);
        return Reflect.set(dependency, propertyKey, value, dependency);
      },
    };

    return new Proxy(this.dependencies.get(key) ?? {}, handler);
  }
}
