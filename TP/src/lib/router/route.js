import { getDuplicates } from "../core";

/**
 * @typedef {import("./types.js").RouterConfiguration} RouterConfiguration
 * @typedef {import("./types.js").NormalizedRoute} NormalizedRoute
 * @typedef {import("./types.js").Route} Route
 * @typedef {import("./types.js").Query} Query
 */

const QUERY_PARAMETER_CHARACTER_IDENTIFIER = ":";

/**
 * Generates URLs for the provided routes and checks for duplicate paths or names.
 *
 * @param {Route[]} routes - The array of routes to process.
 * @returns {NormalizedRoute[]} - The array of normalized routes.
 * @throws {DuplicateRouteError} - If there are duplicate paths or names.
 */
export function generateUrls(routes) {
  const normalizedRoutes = fuseRoutesPaths(routes).map((route) =>
    buildRouteName(route),
  );

  const duplicatePath = getDuplicates(normalizedRoutes, (route) => route.path);

  if (duplicatePath.length > 0) {
    throw new DuplicateRouteError("path", duplicatePath[0].path);
  }

  const duplicateNames = getDuplicates(
    normalizedRoutes.filter((route) => route.name !== undefined),
    (route) => route.name,
  );

  if (duplicateNames.length > 0) {
    throw new DuplicateRouteError("name", duplicateNames[0].name);
  }

  return normalizedRoutes;
}

/**
 * Fuses routes and their paths recursively.
 *
 * @param {Route[]} routes - The array of routes to process.
 * @param {Route[]} [fragments=[]] - The route fragments.
 * @param {string} [path=""] - The base path.
 * @returns {NormalizedRoute[]} - The array of fused routes.
 */
export function fuseRoutesPaths(routes, fragments = [], path = "") {
  // @ts-ignore
  return routes.flatMap((fragment) => {
    let newPath = "";

    if (path === "") {
      newPath = fragment.path;
    } else if (fragment.path === "") {
      newPath = path;
    } else {
      newPath = `${path}/${fragment.path}`;
    }

    newPath = cleanUpPath(newPath);

    if (fragment.children) {
      return fuseRoutesPaths(
        fragment.children,
        [...fragments, fragment],
        newPath,
      );
    }

    return [{ ...fragment, path: newPath, routes: [...fragments, fragment] }];
  });
}

/**
 * Builds route names by keeping the last encountered names.
 *
 * @param {NormalizedRoute} route - The route to process.
 * @returns {NormalizedRoute} - The modified route.
 */
function buildRouteName(route) {
  // keep only last encountered names
  route.routes.forEach((r) => {
    if (r.name !== undefined) route.name = r.name;
  });

  return route;
}

/**
 * Cleans up the path by removing duplicate slashes and trailing slashes.
 *
 * @param {string} path - The path to clean up.
 * @returns {string} - The cleaned-up path.
 */
function cleanUpPath(path) {
  path = path.replaceAll("//", "/");

  if (path[path.length - 1] === "/" && path.length > 1) {
    path = path.slice(0, -1);
  }

  return path;
}

/**
 * Finds a route by query, either by URL or by name and parameters.
 *
 * @param {NormalizedRoute[]} routes - The array of normalized routes.
 * @param {Query} query - The query (URL or name with parameters) to find the route.
 * @returns {NormalizedRoute | undefined} - The matching route, if any.
 */
export function findRouteByQuery(routes, query) {
  if (typeof query === "string") {
    return findRouteByUrl(routes, query);
  }

  const { url, name, parameters } = query;

  if (url !== undefined) {
    return findRouteByUrl(routes, url);
  }

  if (name !== undefined) {
    return findRouteByName(routes, name, parameters);
  }

  return undefined;
}

const paramRe = /^:(.+)/;

/**
 * Splits a URI into its individual segments.
 *
 * @param {string} uri - The URI to segmentize.
 * @returns {string[]} - The array of URI segments.
 */
function segmentize(uri) {
  return uri.replace(/(^\/+|\/+$)/g, "").split("/");
}

/**
 * Finds a route by URL.
 *
 * @param {NormalizedRoute[]} routes - The array of normalized routes.
 * @param {string} url - The URL to find the route.
 * @returns {NormalizedRoute | undefined} - The matching route, if any.
 * @throws {UnknownUrl} - If the URL does not match any route.
 */
export function findRouteByUrl(routes, url) {
  let match;
  const [uriPathname] = url.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "/";

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeSegments = segmentize(route.path);
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    let missed = false;
    let parameters = {};
    for (; index < max; index++) {
      const uriSegment = uriSegments[index];
      const routeSegment = routeSegments[index];
      const fallback = routeSegment === "*";
      if (fallback) {
        parameters["*"] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }
      if (uriSegment === undefined) {
        missed = true;
        break;
      }
      let dynamicMatch = paramRe.exec(routeSegment);
      if (dynamicMatch && !isRootUri) {
        let value = decodeURIComponent(uriSegment);
        parameters[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }
    if (!missed) {
      match = { parameters, ...route };
      break;
    }
  }

  if (match === undefined) {
    throw new UnknownUrl(url, routes);
  }

  match.url = url;

  return match;
}

/**
 * Finds a route by name and optional parameters.
 *
 * @param {NormalizedRoute[]} routes - The array of normalized routes.
 * @param {string} name - The name of the route.
 * @param {Object | undefined} parameters - The parameters for the route.
 * @returns {NormalizedRoute | undefined} - The matching route, if any.
 * @throws {UnknownName} - If the name does not match any route.
 */
export function findRouteByName(routes, name, parameters) {
  const urls = routes.filter((route) =>
    route.routes.some((f) => f.name === name),
  );

  if (parameters === undefined && urls.length > 0) {
    const route = urls[0];
    route.url = route.path;
    return urls[0];
  }

  const parameterRegex = new RegExp(
    `(${QUERY_PARAMETER_CHARACTER_IDENTIFIER}\\w+)`,
  );

  const route = urls.find((route) => {
    let path = cleanUpPath(route.path);
    let rePath = cleanUpPath(route.path);

    route.path.match(parameterRegex)?.forEach((param) => {
      rePath = route.path.replace(
        param,
        `(?<${param.replace(QUERY_PARAMETER_CHARACTER_IDENTIFIER, "")}>\\w+)`,
      );
    });

    const re = new RegExp(rePath);

    Object.entries(parameters).forEach(([key, value]) => {
      path = path.replace(QUERY_PARAMETER_CHARACTER_IDENTIFIER + key, value);
    });

    const result = path.match(re);
    route.parameters = result?.groups;

    if (result !== null) {
      route.url = result.input;
    }

    return result !== null;
  });

  if (route === undefined) {
    throw new UnknownName(name);
  }

  return route;
}

/**
 * @export
 * @class DuplicateRouteError
 * @extends {Error}
 */
export class DuplicateRouteError extends Error {
  /**
   * @constructor
   * @param {"path" | "name"} identifier
   * @param {any} value
   */
  constructor(identifier, value) {
    super(`Duplicated identifiers '${identifier}' = '${value}'`);
  }
}

export class UnknownUrl extends Error {
  /**
   * @constructor
   * @param {string} url
   * @param {NormalizedRoute[]} routes
   */
  constructor(url, routes) {
    const urls = routes.map((route) => route.url).join(", ");
    super(`Could not find route with the following url: '${url}' in ${urls}`);
  }
}

export class UnknownName extends Error {
  /**
   * @constructor
   * @param {string} name
   */
  constructor(name, routes) {
    super(`Could not find route with the following name: '${name}'`);
  }
}
