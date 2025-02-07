import { DependencyResolver } from "./DependencyResolver";
import { Environment, Crate, CrateConfiguration } from "../types";
import { App, RunMode } from "../App";

declare global {
  /**
   * Defines a crate configuration.
   *
   * @param {CrateConfiguration} config - The crate configuration.
   * @returns {CrateConfiguration} The crate configuration.
   */
  function defineCrate(config: CrateConfiguration): CrateConfiguration;

  /**
   * Retrieves the instance of a crate by its name.
   *
   * @param {string} name - The name of the crate.
   * @returns {any} The instance of the crate.
   */
  function use<K extends keyof Crates>(key: K): Crates[K];

  /**
   * Load the instance of a crate by its name.
   *
   * @param {{ name: K, path: string }} parameters
   * @returns {any} The instance of the crate.
   */
  async function loadCrate<K extends keyof Crates>(parameters: {
    name?: K;
    path?: string;
  }): Crates[K];

  /**
   * Returns the instance of a crate by its name.
   *
   * @param {{ name: K, path: string }} parameters
   * @returns {any} The instance of the crate.
   */
  async function loadCrateInstance<K extends keyof Crates>(parameters: {
    name: K;
    path: string;
  }): any;

  /**
   * A class responsible for resolving and managing outter application dependencies.
   *
   * @class
   */
  var dependencyResolver: DependencyResolver;

  /*interface GlobalEventHandlersEventMap {
        "import-crate": CustomEvent<Crate>;
        "imported-crate": CustomEvent<Crate>;
    }*/

  export interface Crates {}
}
