/**
 * @typedef {{match: string, resolve: string[] | string, regexp: RegExp}} Path
 * @param {Record<string, string[] | string>} paths
 * @returns {Path[]}
 */
const parsePaths = (paths) => {
    if (!paths) {
        return [];
    }

    return Object.keys(paths).map((path) => {
        return {
            match: path,
            resolve: paths[path],
            regexp: new RegExp(`^${path.replace("*", ".*")}$`),
        };
    });
};

export { parsePaths };
