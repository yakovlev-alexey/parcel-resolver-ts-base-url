import path from "path";

import { createMemo } from "./memo";

/**
 * @param {import('./memo').Memo<Record<string, unknown>>} memo
 * @param {import('@parcel/fs').FileSystem} fs
 * @param {string} sourcePath
 * @param {string} projectRoot
 * @returns {Promise<{ tsConfig: Record<string, any>, path: string }>}
 */
const getTsConfig = async (memo, fs, sourcePath, projectRoot) => {
    while (true) {
        if (memo[sourcePath]) {
            return { tsConfig: memo[sourcePath], path: sourcePath };
        }

        const tsConfigPath = path.join(sourcePath, "tsconfig.json");
        if (await fs.exists(tsConfigPath)) {
            const tsConfigContent = await fs.readFile(tsConfigPath, "utf-8");

            return {
                tsConfig: (memo[sourcePath] = JSON.parse(tsConfigContent)),
                path: sourcePath,
            };
        }

        if (sourcePath === projectRoot) {
            throw new Error(
                "[parcel-resolver-ts-paths] tsconfig.json not found"
            );
        }

        sourcePath = path.join(sourcePath, "..");
    }
};

const memoizedGetTsConfig = createMemo(getTsConfig);

export { memoizedGetTsConfig as getTsConfig };
