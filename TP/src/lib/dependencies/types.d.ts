import { Environments } from "./DependencyResolver.js";
import { App } from "../types.d.ts";

export type CrateType = "module" | "app";

/**
 * Configuration for a crate (module) in the system.
 * 
 * @interface CrateConfiguration
 * 
 * @example
 * const crateConfig = {
 *     name: 'core',
 *     type: 'module',
 *     main: 'index.js',
 *     component: 'MyComponent',
 *     root: '/root/path',
 *     dependencies: ['lit', 'ui-components'],
 *     override: ['development', 'production'],
 *     configuration: {
 *         name: 'MyApp',
 *         primary: false
 *     }
 * };
 */
export interface BaseCrateConfiguration {
    /**
     * The name of the crate.
     * @type {string}
     */
    name?: string;

    /**
     * The path to the crate.
     * @type {string}
     */
    path?: string;

    /**
     * The type of the crate.
     * @type {CrateType}
     */
    type: CrateType;

    /**
     * The main script file of the crate.
     * @type {string}
     */
    main?: string;

    /**
     * The method to call once the the crate has been imported.
     * @type {boolean | string} 
     * @default {false}
     * 
     * @example
     * defineCrate({ initialization: true })
     * crate.initialization();
     * 
     * @example
     * defineCrate({ initialization: 'testInit' })
     * crate.testInit();
     */
    initialization?: boolean | string = false;

    /**
     * The dependencies of the crate.
     * @type {Array<keyof Crates>}
     */
    dependencies?: (keyof Crates)[] = [];

    /**
     * The environments that override this crate's configuration.
     * @type {Array<Environments>}
     */
    override?: Environments[] = [];

    /**
     * The configuration associated with the crate.
     * @type {Configuration}
     */
    configuration?: Configuration;
}

export interface AppCrateConfiguration extends BaseCrateConfiguration {
    type: "app";

    /**
     * ⚠️ Required for 'app'
     * The html component associated with the crate.
     * @type {string}
     */
    component?: string;

    /**
     * ⚠️ Required for 'app'
     * The css selector for the app to be mounted on.
     * @type {string}
     */
    root?: string;
}

export interface ModuleCrateConfiguration extends BaseCrateConfiguration {
    type: "module";
}

export type CrateConfiguration = ModuleCrateConfiguration | AppCrateConfiguration;

/**
 * A crate (module) in the system, extending CrateConfiguration with additional properties.
 * 
 * @interface Crate
 * @extends CrateConfiguration
 * 
 * @example
 * const crate = {
 *     name: 'core',
 *     path: 'modules/@core',
 *     type: 'module',
 *     main: 'index.js',
 *     component: 'MyComponent',
 *     root: '/root/path',
 *     dependencies: ['lit', 'ui-components'],
 *     override: ['development', 'production'],
 *     configuration: {
 *         name: 'MyApp',
 *         primary: false
 *     },
 *     imported: true,
 *     repo: 'common',
 *     url: 'http://example.com',
 *     instance: {}
 * };
 */
export type BaseCrate<T extends CrateConfiguration> = T & {
    /**
     * Whether the crate has been imported.
     * @type {boolean}
     */
    imported: boolean;

    /**
     * The repository where the crate resides.
     * @type {string}
     */
    repo: string;

    /**
     * The URL to the crate.
     * @type {string}
     */
    url: string;

    /**
     * The instance of the crate after being loaded.
     * @type {any}
     */
    instance: any;
}

export type AppCrate = BaseCrate<AppCrateConfiguration>;
export type ModuleCrate = BaseCrate<ModuleCrateConfiguration>;
export type Crate = BaseCrate<CrateConfiguration>;

export type ExportApp<T> = T & { app: App };

/**
 * A dependency required by a crate.
 * 
 * @interface Dependency
 * 
 * @example
 * const dependency = {
 *     repo: 'common',
 *     path: 'modules/@lit',
 * };
 */
export interface Dependency {
    /**
     * The repository where the dependency resides.
     * @type {string}
     */
    repo: string;

    /**
     * The path to the dependency within the repository.
     * @type {string}
     */
    path: string;
}