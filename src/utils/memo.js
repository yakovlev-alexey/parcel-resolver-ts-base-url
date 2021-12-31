/**
 * @template T
 * @typedef {Record<string, T>} Memo
 */

/**
 * @template T, A
 * @param {(memo: Memo<T>, ...args: A) => T} func
 * @returns {(...args:A) => T}
 */
const createMemo = (func) => {
    const memo = {};

    return () => {
        return func(memo, arguments);
    };
};

export { createMemo };
