import path from "path";

import { createMemo } from "./memo";

/**
 * @param {import('./memo').Memo<Record<string, unknown>>} memo
 * @param {string} folder
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {Promise<Record<string, unknown> | null>}
 */
const getPackage = async (memo, folder, fs) => {
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
        // @ts-expect-error packageContent is a string
        return (memo[folder] = JSON.parse(packageContent));
    } catch (_) {
        return null;
    }
};

const memoizedGetPackage = createMemo(getPackage);

export { memoizedGetPackage as getPackage };
