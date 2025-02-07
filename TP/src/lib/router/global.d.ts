import { AppRouterConfiguration, Route } from "./types.d.ts";

declare global {
  export interface Configuration {
    /**
     * The configuration for the application router.
     *
     * @type {AppRouterConfiguration}
     * @example
     * const appConfig: Configuration = {
     *     router: {
     *         file: './src/router/router.js',
     *         routerKey: 'router',
     *         routesKey: 'routes',
     *         useLocal: false,
     *         useHistory: true,
     *         useMemory: false,
     *         entry: '/'
     *     }
     * };
     */
    router?: AppRouterConfiguration;
  }
}
