export interface DependencyInjectorProvideOptions {
    override?: boolean = false;
}


export class DependencyInjector<T> extends EventTarget {
    dependencies: Map<keyof T?, T[Property]>;

    /**
     * Provide a variable or constant reference associated with a key (string or Symbol).
     * This reference can be accessed via the key within a Proxy object by other scripts that have access to this dependency injector.
     * 
     * ```js
     * const dependencyInjector = new DependencyInjector();
     * dependencyInjector.provide('logger', new Logger());
     * 
     * const logger = dependencyInjector.inject('logger');
     * logger.log('Hello, world!');
     * ```
     */
    provide<K extends keyof T>(key: K, value: T[K] | (() => T[K]), options: DependencyInjectorProvideOptions = {}): T[K];


    /**
     * Retrieve a variable or constant reference associated with a key (string or Symbol).
     * This reference can be accessed using a key within a Proxy object.
     * The proxy object can be obtained either before or after the reference has been provided.
     * ⚠ Please note that the reference cannot be used before it is defined.
     * 
     * 
     * ```js
     * // normal use case
     * const dependencyInjector = new DependencyInjector();
     * dependencyInjector.provide('logger', new Logger());
     * 
     * const logger = dependencyInjector.inject('logger');
     * logger.log('Hello, world!');
     * 
     * 
     * 
     * // tricky use case
     * const dependencyInjector = new DependencyInjector();
     * const logger = dependencyInjector.inject('logger');
     * 
     * // won't work before providing the logger into the dependencyInjector
     * logger.log('Hello, world!');
     * 
     * dependencyInjector.provide('logger', new Logger());
     * // will work 
     * logger.log('Hello, world!');
     * ```
     */
    inject<K extends keyof T>(key: K): T[K];
}