import { Controller } from "../rlx-lit/index.js";
import { RouteResolver } from "./RouteResolver.js";
import { RouterView } from "./RouterView.js";

/**
 * @typedef {import("./types.d.ts").RouterConfiguration} RouterConfiguration
 * @typedef {import("./types.d.ts").NormalizedRoute} NormalizedRoute
 * @typedef {import("./types.d.ts").Route} Route
 * @typedef {import("./types.d.ts").Query} Query
 */

/**
 * Class responsible for managing routing, including navigation and route resolution.
 *
 * ```js
 * const routerConfig = {
 *     routes: [
 *         { path: '/home', name: 'home', component: HomeComponent },
 *         { path: '/about', name: 'about', component: AboutComponent },
 *     ],
 *     useHistory: true,
 *     useMemory: true,
 *     entry: { url: '/home' }
 * };
 * const router = new Router(routerConfig);
 * ```
 *
 * @export
 * @class Router
 * @extends {Controller}
 *
 */
export class Router extends Controller {
  /**
   * The route resolver instance used by this router.
   *
   * @type {RouteResolver}
   */
  resolver;

  /**
   * The RouterView instance associated with this router.
   *
   * @type {RouterView}
   */
  view;

  /**
   * The subpath used by this router when acting as a sub-router.
   *
   * @type {string | undefined}
   */
  subpath;

  /**
   * Indicates whether to use local routing.
   *
   * @type {boolean}
   */
  useLocal = false;

  /**
   * @param {RouterConfiguration} parameters - The router configuration parameters.
   */
  constructor(parameters) {
    super();

    this.useLocal = parameters.useLocal;

    this.resolver = new RouteResolver(parameters);
    this.resolver.routers.push(this);

    // Modifié par Romain
    this.resolver.to(location.pathname);
  }

  /**
   * Gets the current normalized route.
   *
   * @readonly
   * @type {NormalizedRoute}
   */
  get route() {
    return this.resolver.route;
  }

  /**
   * Gets the list of all routes.
   *
   * @readonly
   * @type {Route[]}
   */
  get routes() {
    return this.resolver.routes;
  }

  /**
   * Checks if this router is a sub-router.
   *
   * @readonly
   * @type {boolean}
   */
  get isSubRouter() {
    return this.subpath !== undefined;
  }

  /**
   * Gets the current path of the router.
   *
   * @readonly
   * @type {string}
   */
  get path() {
    return this.isSubRouter
      ? this.resolver.path.replace(this.subpath, "")
      : this.resolver.path;
  }

  /**
   * Navigates to the specified query.
   * Does not register the route using history or memory. If you want to use 'push' instead.
   *
   * @param {Query} query - The query to navigate to.
   *
   * @example
   * router.to({ url: '/about' });
   * router.to('/home');
   */
  to(query) {
    if (this.isSubRouter) {
      if (typeof query === "string") {
        query = this.subpath + query;
      } else if (query.url !== undefined) {
        query.url = this.subpath + query;
      }
    }

    this.resolver.to(query);
  }

  /**
   * Navigates to the specified query.
   *
   * @param {Query} query - The query to navigate to.
   *
   * @example
   * router.to({ url: '/about' });
   * router.to('/home');
   */
  push(query) {
    if (this.isSubRouter) {
      if (typeof query === "string") {
        query = this.subpath + query;
      } else if (query.url !== undefined) {
        query.url = this.subpath + query;
      }
    }

    this.resolver.push(query);
  }

  /**
   * Sets the current route and updates the RouterView.
   *
   * @param {NormalizedRoute} route - The normalized route to set.
   */
  setRoute(route) {
    this.view?.setRoute(route);
    this.requestUpdate();

    this.dispatchEvent(new CustomEvent("resolve-route", { detail: route }));
  }

  /**
   * Registers this router as a sub-router of the given parent router.
   *
   * @param {Router} parentRouter - The parent router to register with.
   */
  registerAsSubRouter(parentRouter) {
    this.subpath = parentRouter.path;
  }

  /**
   * Resets all routes, computes the new ones, and refreshes the navigation to the current path.
   *
   * @param {Route[]} routes - The array of new route configurations.
   */
  setRoutes(routes) {
    this.resolver.setRoutes(routes);
    this.to(this.route.path);
    this.view.requestUpdate();
  }
}
