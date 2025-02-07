import { findRouteByQuery, generateUrls } from "./route.js";
import { Router } from "./Router.js";

/**
 * @typedef {import("./types.js").RouterConfiguration} RouterConfiguration
 * @typedef {import("./types.js").NormalizedRoute} NormalizedRoute
 * @typedef {import("./types.js").Route} Route
 * @typedef {import("./types.js").Query} Query
 */

/**
 * Class responsible for resolving routes and managing navigation.
 *
 * @export
 * @class RouteResolver
 * @extends {EventTarget}
 */
export class RouteResolver extends EventTarget {
  /** @type {Route[]} */
  routes;

  /** @type {boolean} */
  useHistory;

  /** @type {boolean} */
  useMemory;

  /** @type {string} */
  url;

  /** @type {NormalizedRoute} */
  route;

  /** @type {NormalizedRoute[]} */
  urls;

  /** @type {Router[]} */
  routers;

  /**
   * Gets the current path of the resolved route.
   *
   * @readonly
   * @type {string}
   */
  get path() {
    return this.route?.path;
  }

  /**
   * Creates an instance of RouteResolver.
   *
   * @constructor
   * @param {RouterConfiguration} configuration - The router configuration.
   */
  constructor({ routes, useHistory, useMemory, entry }) {
    super();

    this.useHistory = useHistory ?? false;
    this.useMemory = useMemory ?? false;
    this.routers = [];
    this.setRoutes(routes ?? []);

    if (this.useMemory && localStorage.getItem("route")) {
      this.to(localStorage.getItem("route"));
    } else if (entry) {
      this.to(entry);
    }

    if (this.useHistory) {
      window.addEventListener("popstate", (event) => {
        this.to(event.state, true);
      });
    }
  }

  /**
   * Navigates to a specified route based on the query.
   * Does not register the route using history or memory. If you want to use 'push' instead.
   *
   * @param {Query} query - The query data to find the route.
   * @param {boolean} [isBack=false] - Indicates if the navigation is a back action in the history.
   *
   * @example
   * resolver.to({ url: '/about' });
   */
  to(query, isBack = false) {
    try {
      const route = findRouteByQuery(this.urls, query);
      this.setRoute(route, isBack, false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Navigates to a specified route based on the query.
   *
   * @param {Query} query - The query data to find the route.
   * @param {boolean} [isBack=false] - Indicates if the navigation is a back action in the history.
   *
   * @example
   * resolver.to({ url: '/about' });
   */
  push(query, isBack = false) {
    try {
      const route = findRouteByQuery(this.urls, query);
      this.setRoute(route, isBack, true);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Sets the current route and optionally updates history and memory.
   *
   * @param {NormalizedRoute} route - The normalized route to set.
   * @param {boolean} [isBack=false] - Indicates if the navigation is a back action in the history.
   */
  setRoute(route, isBack = false, isPush = true) {
    this.route = route;

    this.routers.forEach((router) => router.setRoute(route));

    if (isPush === false) {
      return;
    }

    if (this.route && this.useHistory && isBack === false) {
      // Modifié par Romain pour la formation :
      history.pushState(this.route.url, "", this.route.url);
      // history.pushState(this.route.url, "");
    }

    if (this.useMemory) {
      localStorage.setItem("route", this.route.url);
    }
  }

  /**
   * Sets the routes and generates the corresponding URLs for navigation.
   *
   * @param {Route[]} routes - The array of route configurations.
   */
  setRoutes(routes) {
    this.routes = routes;
    this.#buildUrls(this.routes);
  }

  /**
   * Builds normalized URLs from the provided routes.
   *
   * @param {Route[]} routes - The array of route configurations.
   */
  #buildUrls(routes) {
    this.urls = generateUrls(routes);
  }
}

export const routeResolverKey = "global-route-resolver";
