/**
 * @template T
 * @typedef {Record<string, T>} Memo
 */

/**
 * @template {Array<unknown>} A
 * @template T, R
 * @param {(memo: Memo<T>, ...args: A) => R} func
 * @returns {(...args:A) => R}
 */
const createMemo = (func) => {
    /**
     * @type {Memo<T>}
     */
    const memo = {};

    return (...args) => {
        return func(memo, ...args);
    };
};

export { createMemo };
