import { callAjaxDynamicActionAsync } from "../utils/apriso.js";
import { getCurrentEnvironment } from "../context/Environment.js";
import { deepMerge } from "../utils/object.js";
import { configurationKey, sessionKey, shared } from "../index.js";
// import { configurationKey } from "../configuration.js";

/**
 * @typedef {import("./types").Crate} Crate
 * @typedef {import("./types").CrateConfiguration} CrateConfiguration
 * @typedef {import("./types").Dependency} Dependency
 */

const map = {
  // #region modules

  core: {
    repo: "Common",
    path: "modules/@core",
  },
  lit: {
    repo: "Common",
    path: "modules/@lit",
  },
  "ui-components": {
    repo: "Common",
    path: "modules/@ui-components",
  },
  essentials: {
    repo: "Common",
    path: "modules/@essentials",
  },

  // #endregion

  // #region functionnal-components

  employee: {
    repo: "Common",
    path: "modules/functionnal-components/@employee",
  },

  // #endregion

  "svq-controle-reception": {
    repo: "SvqControlReceptionApp",
    path: "",
  },
};

const crates = {};

/**
 * @export
 * @param {{ root?: string; forceRoot?: boolean; localhost?: boolean; reuse?: boolean; }} [parameters={}]
 * @returns {*}
 */
export function initializeDependencyResolver({
  root = location.origin,
  forceRoot = false,
  localhost = true,
  reuse = true,
} = {}) {
  if (self.dependencyResolver && reuse === true) {
    return self.dependencyResolver;
  }

  if (forceRoot === false) {
    const session = shared.inject(sessionKey);

    const localRoot = session.isLocalWebAppDebug
      ? "http://127.0.0.1:5500"
      : location.origin;

    root = session.localHost
      ? localRoot
      : "/Apriso/Portal/Scripts/WebApplication";
  }

  const dependencyResolver = new DependencyResolver(root, localhost);

  self.dependencyResolver = dependencyResolver;
  self.use = (name) => dependencyResolver.use(name);
  self.loadCrateInstance = (parameters) =>
    dependencyResolver.loadCrateInstance(parameters);
  self.defineCrate = (config) => dependencyResolver.defineCrate(config);

  return dependencyResolver;
}

/**
 * A class responsible for resolving and managing outter application dependencies.
 */
export class DependencyResolver extends EventTarget {
  // configuration = shared.inject(configurationKey);

  /**
   * The root URL for the repositories.
   *
   * @type {string}
   */
  root = undefined;

  /**
   * Indicates whether the environment is localhost.
   *
   * @type {boolean}
   */
  isLocalhost = false;

  /**
   * An object mapping repository names to their URLs.
   *
   * @type {Map<string, string>}
   */
  repos = new Map();

  /**
   * A mapping of external loaders for crates.
   *
   * @type {Map<string, (crate: Crate) => void>}
   */
  crateLoaders = new Map();

  /**
   * A mapping of crate names to their data.
   *
   * @type {Map<string, Crate>}
   */
  crates = new Map();

  /**
   * Creates an instance of DependencyResolver.
   *
   * @param {string} root - The root URL for the repositories.
   * @param {boolean} isLocalhost - Indicates whether the environment is localhost.
   */
  constructor(root, isLocalhost) {
    super();

    this.root = root;
    this.isLocalhost = isLocalhost;
  }

  /**
   * Defines a crate configuration.
   *
   * @param {CrateConfiguration} config - The crate configuration.
   * @returns {CrateConfiguration} The crate configuration.
   */
  defineCrate(config) {
    return config;
  }

  /**
   * Adds a crate loader for the specified key.
   *
   * @param {string} key - The key identifying the crate.
   * @param {(crate: Crate) => void} loader - The loader function for the crate.
   * @returns {() => void} - Callback to remove the loader
   */
  addCrateLoader(key, loader) {
    this.crateLoaders.set(key, loader);

    const removeLoader = () => {
      this.crateLoaders.delete(key);
    };

    return removeLoader;
  }

  /**
   * Retrieves the instance of a crate by its name.
   *
   * @param {string} name - The name of the crate.
   * @returns {any} The instance of the crate.
   */
  use(name) {
    if (this.crates.has(name) === false) {
      throw new Error(
        `Missing crate: "${name}", did you forget to add ${name} as a dependency ?`,
      );
    }

    const crate = this.crates.get(name);
    const instance = crate.instance ?? {};

    return instance;
  }

  /**
   * @param {string} name
   * @returns {boolean}
   */
  hasCrate(name) {
    return map[name] !== undefined;
  }

  /**
   * Entry point for loading a crate.
   *
   * @param {Object} parameters
   * @param {string} parameters.name
   * @param {string} parameters.path
   * @returns {Promise<Crate>} The loaded crate.
   */
  async loadCrate({ name, path }) {
    return dependencyResolver.hasCrate(name) && name !== ""
      ? // @ts-ignore
        dependencyResolver.loadCrateByName(name)
      : dependencyResolver.loadCrateFromRepo({ repo: path, path: "" });
  }

  /**
   * Entry point for loading a crate but returns its instance.
   *
   * @param {Object} parameters
   * @param {string} parameters.name
   * @param {string} parameters.path
   * @returns {Promise<any>} The loaded crate.
   */
  async loadCrateInstance(parameters) {
    const { instance } = await this.loadCrate(parameters);
    return instance;
  }

  /**
   * Loads a crate from the repository.
   *
   * @param {Dependency} dependency - The dependency to load.
   * @returns {Promise<Crate>} The loaded crate.
   */
  async loadCrateFromRepo(dependency) {
    const identifier = dependency.repo + "/" + dependency.path;

    // check if the crate had already been loaded globally
    if (identifier in crates) {
      const crate = crates[identifier];

      // reimport the crate if the dependency resolver isn't the one that loaded the crate
      if (this.crates.has(crate.name) === false) {
        await this.importCrate(crate);
      }

      return crate;
    }

    await this.#loadReposUrl([dependency.repo]);

    const crate = await this.#fetchCrate(dependency);

    if (crate.dependencies) {
      for (const name of crate.dependencies) {
        await this.loadCrateByName(name);
      }
    }

    await this.importCrate(crate);

    crates[identifier] = crate;

    await this.#callCrateLoaders(crate);

    return crate;
  }

  /**
   * Loads a crate by its name.
   *
   * @async
   * @param {keyof map} name - The name of the crate.
   * @returns {Promise<Crate>} The loaded crate.
   *
   * @example
   * const crate = await dependencyResolver.loadCrateByName('core');
   * console.log(crate);
   */
  async loadCrateByName(name) {
    if (this.hasCrate(name) === false) {
      throw new Error(
        `Missing dependency locator for: ${name}, did you forget to add ${name} locator inside the resolver map ?`,
      );
    }

    return await this.loadCrateFromRepo({ ...map[name] });
  }

  /**
   * Imports the specified crate.
   *
   * @async
   * @param {Crate} crate - The crate to import.
   * @returns {Promise<void>}
   */
  async importCrate(crate) {
    if (this.crates.has(crate.name) === true) {
      return;
    }

    this.crates.set(crate.name, crate);

    if (crate.main === undefined) {
      throw new Error(
        `The crate: "${crate.name}" is missing its main sript, did you forget to specify its "main" property ?`,
      );
    }

    this.dispatchEvent(new CustomEvent("import-crate", { detail: crate }));

    await this.#callCrateLoaders(crate);
    crate.instance = {
      ...(await import(/* @vite-ignore */ `${crate.url}/${crate.main}`)),
      ...(crate.instance ?? {}),
    };
    this.dispatchEvent(new CustomEvent("imported-crate", { detail: crate }));

    if (crate.initialization) {
      const methodName =
        crate.initialization === true ? "initialization" : crate.initialization;

      if (methodName in crate.instance === false) {
        throw new Error(
          `The crate: "${crate.name}" has not initialization method named '${methodName}', did you named it correctly ?`,
        );
      }

      crate.instance[methodName]();
    }
  }

  /**
   * Retrieves the URL of the specified crate.
   *
   * @param {keyof Crates} name - The name of the crate.
   * @returns {string} The URL of the crate.
   */
  getCrateUrl(name) {
    if (this.crates.has(name) === false) {
      return "";
    }

    return this.crates.get(name).url;
  }

  /**
   * Fetches a crate from the repository.
   *
   * @param {Dependency} dependency - The dependency to fetch.
   * @returns {Promise<Crate>} The fetched crate.
   *
   * @throws Will throw an error if the crate is missing or invalid.
   */
  async #fetchCrate({ repo, path = "" }) {
    try {
      const url = this.root + this.repos.get(repo) + path;

      const result = await import(/* @vite-ignore */ url + "/crate.js");
      /** @type {Crate} */
      let crate = result.default;

      crate.repo = repo;
      crate.url = crate.path ? this.root + crate.path : url;

      crate = deepMerge(
        crate,
        await this.#fetchEnvironmentCrate(crate, url),
        await this.#fetchRunModeCrate(crate, url),
      );

      return crate;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `Missing or wrong crate.js at: '${path}'. Did you forget to create the crate.js at: '${path}' or that it's is not valid ?`,
        );
      }

      throw error;
    }
  }

  /**
   * Fetches an environment-specific crate configuration.
   *
   * @async
   * @param {Crate} crate - The crate to fetch environment-specific configuration for.
   * @param {string} url - The URL of the crate.
   * @returns {Promise<Crate | {}>} The environment-specific crate configuration.
   *
   * @throws Will throw an error if the environment-specific crate configuration is missing or invalid.
   */
  async #fetchEnvironmentCrate(crate, url) {
    const currentEnvironment = getCurrentEnvironment();
    const name = `crate.${currentEnvironment}.js`;
    const path = `${url}/${name}`;

    if (crate.override?.includes(currentEnvironment)) {
      try {
        const result = await import(/* @vite-ignore */ path);
        return result.default;
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error(
            `Missing or wrong '${name}' at: '${path}'. Did you forget to create the '${name}' at: '${path}' or that it's is not valid ?`,
          );
        }
      }
    }

    return {};
  }

  /**
   * Fetches an environment-specific crate configuration.
   *
   * @async
   * @param {Crate} crate - The crate to fetch environment-specific configuration for.
   * @param {string} url - The URL of the crate.
   * @returns {Promise<Crate | {}>} The environment-specific crate configuration.
   *
   * @throws Will throw an error if the environment-specific crate configuration is missing or invalid.
   */
  async #fetchRunModeCrate(crate, url) {
    const { runMode } = shared.inject(configurationKey);
    const name = `crate.${runMode}.js`;
    const path = `${url}/${name}`;

    if (crate.type === "app" && crate.override?.includes(runMode)) {
      try {
        const result = await import(/* @vite-ignore */ path);
        return result.default;
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error(
            `Missing or wrong '${name}' at: '${path}'. Did you forget to create the '${name}' at: '${path}' or that it's is not valid ?`,
          );
        }
      }
    }

    return {};
  }

  /**
   * Loads the URLs for the specified repositories.
   *
   * @param {string[]} repos - The repositories to load URLs for.
   * @returns {Promise<void>}
   */
  async #loadReposUrl(repos) {
    repos = repos.filter((repo) => this.repos.has(repo) === false);

    if (repos.length === 0) {
      return;
    }

    if (this.isLocalhost) {
      return repos.forEach((repo) => this.repos.set(repo, `/${repo}/`));
    }

    const versions = await this.#getReposVersionFromServer(repos);

    versions.forEach((version, index) => {
      const repo = repos[index];
      this.repos.set(repo, `/${repo}/${version}/`);
    });
  }

  /**
   * @async
   * @param {Crate} crate
   * @returns {Promise}
   */
  async #callCrateLoaders(crate) {
    return await Promise.all(
      Array.from(this.crateLoaders.values()).map((loader) => loader(crate)),
    );
  }

  /**
   * Gets the versions of the specified repositories from the server.
   *
   * @async
   * @param {string[]} webApps - The names of the repositories.
   * @returns {Promise<string[]>} The versions of the repositories.
   */
  async #getReposVersionFromServer(webApps) {
    const { WebAppVersions } = await callAjaxDynamicActionAsync(
      "WebApplication_GetAppVersion",
      "1.0",
      { WebApps: webApps },
    );
    return WebAppVersions;
  }
}
