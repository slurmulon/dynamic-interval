export interface IntervalEngine {
    create: Function;
    clear: Function;
}
/**
 * @param {Function} next method that calculates and returns the interval gap for the next tick
 * @param {Object|Number} config initial configuration object / context. ex: { wait: 50 }
 * @returns {Object}
 */
export declare const setDynterval: (next: any, config: any) => {
    readonly current: any;
    context: any;
    clear(): void;
};
export default setDynterval;
