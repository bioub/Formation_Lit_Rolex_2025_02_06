/** @typedef {import("lit").LitElement} OriginalLitElement */

export class Controller extends EventTarget {
  /**
   * @type {Set<OriginalLitElement>}
   */
  hosts = new Set();

  /**
   * @param {OriginalLitElement} host
   */
  addHost(host) {
    this.hosts.add(host);
    host.addController(this);
  }

  /**
   * @param {OriginalLitElement} host
   */
  removeHost(host) {
    host.removeController(this);
    this.hosts.delete(host);
  }

  requestUpdate() {
    this.hosts.forEach((host) => host.requestUpdate());
  }

  addController() {}
  removeController() {}
  updateComplete = new Promise(() => true);
}

export class Store extends Controller {}

/**
 * @template {OriginalLitElement} T
 * @param {(new (...args: any[]) => T)} superClass
 * @returns {T}
 */
// @ts-ignore
export const SelfControlledMixin = (superClass) =>
  class extends superClass {
    /** @type {Controller[]} */
    controllers = [];

    connectedCallback() {
      super.connectedCallback();

      this.controllers.forEach((controller) => {
        controller.addHost(this);
      });
    }

    disconnectedCallback() {
      this.controllers.forEach((controller) => {
        controller.removeHost(this);
      });

      // @ts-ignore
      this.P?.forEach((controller) => {
        controller?.removeHost?.(this);
      });

      super.disconnectedCallback();
    }
  };
