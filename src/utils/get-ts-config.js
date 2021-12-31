import { createMemo } from "./memo";

/**
 * @param {import('./memo').Memo<Record<string, unknown>>} memo
 * @param {string} projectRoot
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {Record<string, unknown>}
 */
const getTsConfig = async (memo, projectRoot, fs) => {
    if (memo[projectRoot]) {
        return memo[projectRoot];
    }

    const tsConfigPath = path.join(projectRoot, "tsconfig.json");
    const tsConfigContent = await fs.readFile(tsConfigPath);

    return (memo[projectRoot] = JSON.parse(tsConfigContent));
};

const memoizedGetTsConfig = createMemo(getTsConfig);

export { memoizedGetTsConfig as getTsConfig };
