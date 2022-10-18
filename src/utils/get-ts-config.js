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

        try {
            if (await fs.exists(tsConfigPath)) {
                const tsConfigContent = await fs.readFile(
                    tsConfigPath,
                    "utf-8"
                );

                return {
                    tsConfig: (memo[sourcePath] = JSON.parse(tsConfigContent)),
                    path: sourcePath,
                };
            }
        } catch (err) {
            throw new Error(
                `Unexpected exception when reading ${path.relative(
                    projectRoot,
                    tsConfigPath
                )}: ${err instanceof Error ? err.message : err}`
            );
        }

        if (sourcePath === projectRoot) {
            throw new Error(
                `tsconfig.json not found in ${path.relative(
                    projectRoot,
                    sourcePath
                )}`
            );
        }

        sourcePath = path.join(sourcePath, "..");
    }
};

const memoizedGetTsConfig = createMemo(getTsConfig);

export { memoizedGetTsConfig as getTsConfig };
