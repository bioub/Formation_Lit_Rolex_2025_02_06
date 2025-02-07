import { LitElement, nothing } from "lit";

/**
 * @typedef {import("./types.d.ts").RouterConfiguration} RouterConfiguration
 * @typedef {import("./types.d.ts").NormalizedRoute} NormalizedRoute
 * @typedef {import("./types.d.ts").Route} Route
 * @typedef {import("./types.d.ts").Query} Query
 * @typedef {import("./Router.js").Router} Router
 */

/**
 * RouterView component used to render routes based on the router configuration.
 *
 * @export
 * @class RouterView
 * @extends {LitElement}
 */
export class RouterView extends LitElement {
  static properties = {
    router: {},
    renderProperties: {},
  };

  /**
   * The router instance associated with this view.
   *
   * @type {Router}
   */
  // router;

  /**
   * The parent RouterView instance.
   *
   * @type {RouterView}
   */
  // parent;

  /**
   * The child RouterView instance.
   *
   * @type {RouterView}
   */
  // child;

  constructor() {
    super();

    this.renderProperties = {};
  }

  /**
   * Checks if this RouterView is the root view.
   *
   * @readonly
   * @type {boolean}
   */
  get isRoot() {
    // return this.router !== undefined && this.router?.view === this;
    return this.parent === undefined;
  }

  /**
   * Gets the index of this RouterView in the hierarchy.
   *
   * @readonly
   * @type {number}
   */
  get index() {
    return this.isRoot === true ? 0 : this.parent.index + 1;
  }

  /**
   * Gets the current fragment route for this RouterView.
   *
   * @type {Route | undefined}
   */
  get fragment() {
    if (this.router === undefined) {
      return;
    }

    return this.#getFragmentRoute(this.router?.route, this.index);
  }

  connectedCallback() {
    super.connectedCallback();

    this.parent = this.#getAncestor();

    if (this.router === undefined) {
      if (this.parent === undefined) {
        return console.error("Missing router attribute to RouterView");
      }

      this.router = this.parent.router;
      this.parent.child = this;
    } else {
      if (this.parent === undefined || this.router.useLocal === true) {
        this.router.view = this;
        this.parent = undefined;
      } else {
        if (this.parent.router !== this.router) {
          // this.parent.child = this;
          // this.router.registerAsSubRouter(this.parent.router);
          this.router.view = this;
          this.parent = undefined;
        } else {
          this.parent.child = this;
        }
      }
    }

    this.setRoute(this.router.route);
  }

  render() {
    if (this.fragment === undefined) {
      return;
    }

    if (this.fragment.component) {
      // component is a function and not a class, that means it hasn't finished loading
      if (/^\s*class/.test(this.fragment.component.toString()) === false) {
        return nothing;
      }

      // @ts-ignore
      return new this.fragment.component();
    }

    return this.fragment.render(this.renderProperties);
  }

  /**
   * Sets the route for this RouterView.
   *
   * @param {NormalizedRoute} route - The route to set.
   */
  setRoute(route) {
    if (
      this.#getFragmentRoute(this.route, this.index)?.path ===
        this.#getFragmentRoute(route, this.index)?.path &&
      this.child !== undefined
    ) {
      return this.child.setRoute(route);
    }

    this.#getFragmentRoutesBellow(this.route, this.index)
      .toReversed()
      .forEach((r) => r.onBeforeLeave?.());
    this.route = route;

    if (this.#loadFragmentComponent() === false) {
      this.fragment?.onBeforeEnter?.();
      this.requestUpdate();
    }
  }

  /**
   * Gets the fragment route at a given index.
   *
   * @param {NormalizedRoute} route - The normalized route.
   * @param {number} index - The index to get the fragment route.
   * @return {Route | undefined} - The fragment route, if any.
   */
  #getFragmentRoute(route, index) {
    if (route === undefined || route.routes.length < index) {
      return undefined;
    }

    return route.routes[index];
  }

  /**
   * Gets all fragment routes below a given index.
   *
   * @param {NormalizedRoute} route - The normalized route.
   * @param {number} index - The index to get the fragment routes below.
   * @return {Route[]} - The array of fragment routes below the index.
   */
  #getFragmentRoutesBellow(route, index) {
    if (route === undefined || route.routes.length < index) {
      return [];
    }

    return route.routes.reduce(
      (acc, route, routeIndex) => (index <= routeIndex ? [...acc, route] : acc),
      [],
    );
  }

  /**
   * Gets the ancestor RouterView.
   *
   * @param {Node} [node = this] - The node to start the search from.
   * @returns {RouterView | undefined} - The ancestor RouterView, if any.
   */
  #getAncestor(node = this) {
    // @ts-ignore
    const parent = node.parentNode || node.host;

    if (!parent) {
      return undefined;
    }

    if (parent instanceof RouterView) {
      return parent;
    }

    return this.#getAncestor(parent);
  }

  /**
   * Loads the fragment component, if it is not already loaded.
   *
   * @returns {boolean} - true if the component is being loaded, false otherwise.
   */
  #loadFragmentComponent() {
    if (
      this.fragment &&
      this.fragment.component &&
      /^\s*class/.test(this.fragment.component.toString()) === false
    ) {
      // @ts-ignore
      this.fragment.component().then((module) => {
        // take the first exported class from the module
        this.fragment.component = Object.values(module).filter(
          (value) => /^\s*class/.test(value.toString()) === true,
        )[0];

        this.fragment?.onBeforeEnter?.();
        this.requestUpdate();
      });

      return true;
    }

    return false;
  }
}

customElements.define("rlx-flx-router-view", RouterView);
