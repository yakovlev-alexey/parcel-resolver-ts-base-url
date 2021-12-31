/**
 * @param {string} specifier
 * @param {import("./parse-paths").Path[]} paths
 * @returns {import("./parse-paths").Path | null}
 */
const matchPath = (specifier, paths) => {
    for (const path of paths) {
        if (path.regexp.test(specifier)) {
            return path;
        }
    }

    return null;
};

export { matchPath };
