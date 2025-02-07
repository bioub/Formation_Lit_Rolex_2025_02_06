/**
 * Configuration options for the router.
 * 
 * @interface Options
 * 
 * @property {boolean} [useLocal=false] - Whether to use local routes.
 * @property {boolean} [useHistory=true] - Whether to use the browser's history API for navigation.
 * @property {boolean} [useMemory=false] - Enables local storage memory to remember the last route the user visited.
 * @property {Query} [entry] - The initial entry point for the router.
 * 
 * @example
 * const options: Options = {
 *     useLocal: true,
 *     useHistory: false,
 *     useMemory: true,
 *     entry: { url: '/home', parameters: { userId: '123' } }
 * };
 */
export interface Options {
    /**
     * Whether to use local routes.
     * @default false
     */
    useLocal?: boolean = false;

    /**
     * Whether to use the browser's history API for navigation.
     * @default true
     */
    useHistory?: boolean = true;

    /**
     * Enables local storage memory to remember the last route the user visited.
     * @default false
     */
    useMemory?: boolean = false;

    /**
     * The initial entry point for the router.
     */
    entry?: Query;
}

/**
 * Configuration for the router including routes and options.
 * 
 * @interface RouterConfiguration
 * @extends {Options}
 * 
 * @property {Route[]} routes - An array of route configurations.
 * 
 * @example
 * const routerConfig: RouterConfiguration = {
 *     routes: [
 *         { path: '/home', name: 'home', component: HomePage },
 *         { path: '/about', name: 'about', component: AboutPage }
 *     ],
 *     useLocal: true,
 *     useHistory: false,
 *     useMemory: true
 * };
 */
export interface RouterConfiguration extends Options {
    /**
     * An array of route configurations.
     */
    routes: Route[];
}

/**
 * Configuration for the app router with additional file and key settings.
 * 
 * @interface AppRouterConfiguration
 * @extends {Options}
 * 
 * @property {string} [file] - The file path for the router.
 * @property {string} [routerKey] - The key for accessing the router instance.
 * @property {string} [routesKey] - The key for accessing the router routes.
 * 
 * @example
 * const appRouterConfig: AppRouterConfiguration = {
 *     file: './router.js',
 *     routerKey: 'mainRouter',
 *     routesKey: 'appRoutes',
 *     useLocal: true,
 *     useHistory: false,
 *     useMemory: true
 * };
 */
export interface AppRouterConfiguration extends Options {
    /**
     * The file path for the router.
     */
    file?: string;

    /**
     * The key for accessing the router instance.
     */
    routerKey?: string;

    /**
     * The key for accessing the router routes.
     */
    routesKey?: string;
}

/**
 * Configuration for an individual route.
 * 
 * @typedef {Object} Route
 * 
 * @property {string} path - The path of the route.
 * @property {string} [name] - The name of the route.
 * @property {string} [pageName] - The page name for the route.
 * @property {(properties: Object) => any} [render] - Function to render the route.
 * @property {(new (...args: any[]) => HTMLElement) | (() => void)} [component] - The component associated with the route.
 * @property {Route[]} [children] - Array of child routes.
 * @property {() => void} [onBeforeEnter] - Hook to run before entering the route.
 * @property {() => void} [onBeforeLeave] - Hook to run before leaving the route.
 * 
 * @example
 * const route: Route = {
 *     path: '/home',
 *     name: 'home',
 *     component: HomePage,
 *     children: [
 *         { path: 'details', name: 'homeDetails', component: HomeDetailsPage }
 *     ],
 *     onBeforeEnter: () => console.log('Entering home route'),
 *     onBeforeLeave: () => console.log('Leaving home route')
 * };
 */
export type Route = {
    /**
     * The path of the route
     */
    path: string;

    /**
     * The name of the route.
     */
    name?: string;

    /**
     * The page name for the route.
     */
    pageName?: string;

    /**
     * Function to render the route.
     */
    render?: (properties: Object) => any;

    /**
     * The component associated with the route.
     */
    component?: (new (...args: any[]) => HTMLElement) | (() => void);
    
    /**
     * Array of child routes.
     */
    children?: Route[];
    
    /**
     * Hook to run before entering the route.
     */
    onBeforeEnter?: () => void;

    /**
     * Hook to run before leaving the route.
     */
    onBeforeLeave?: () => void;
}

/**
 * Normalized representation of a route including parameters and URL.
 * 
 * @typedef {Object} NormalizedRoute
 * @extends {Route}
 * 
 * @property {Object} parameters - The parameters for the route.
 * @property {string} url - The URL of the route.
 * @property {Route[]} routes - The array of routes.
 * 
 * @example
 * const normalizedRoute: NormalizedRoute = {
 *     path: '/home',
 *     name: 'home',
 *     parameters: { userId: '123' },
 *     url: '/home',
 *     routes: [{ path: '/home/details', name: 'homeDetails' }]
 * };
 */
export type NormalizedRoute = {
    /**
     * The parameters for the route.
     */
    parameters: Object;

    /**
     * The URL of the route.
     */
    url: string;

    /**
     * The array of routes.
     */
    routes: Route[];
} & Route;

/**
 * Query object for finding routes.
 * 
 * @typedef {Object} Query
 * 
 * @property {string} [url] - The URL to query.
 * @property {string} [name] - The name to query.
 * @property {Object} [parameters] - The parameters for the query.
 * 
 * @example
 * const query: Query = { url: '/home' };
 * const queryByName: Query = { name: 'home', parameters: { userId: '123' } };
 */
export type Query = {
    /**
     * The URL to query.
     */
    url?: string;
    
    /**
     * The name to query.
     */
    name?: string;

    /**
     * The parameters for the query.
     */
    parameters?: Object;
} | string;