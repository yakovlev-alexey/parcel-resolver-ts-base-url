import path from "path";

import { createMemo } from "./memo";

/**
 * @param {import('./memo').Memo<Record<string, unknown>>} memo
 * @param {string} folder
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {Record<string, unknown>}
 */
const getPackage = (memo, folder, fs) => {
    if (memo[folder]) {
        return memo[folder];
    }

    const packagePath = path.resolve(folder, "package.json");

    const packageExists = await fs.exists(packagePath);

    if (!packageExists) {
        return null;
    }

    const packageContent = await fs.readFile(packagePath);

    try {
        return (memo[folder] = JSON.parse(packageContent));
    } catch (_) {
        return null;
    }
};

const memoizedGetPackage = createMemo(getPackage);

export { memoizedGetPackage as getPackage };
