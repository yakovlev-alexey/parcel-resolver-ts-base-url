import path from "path";

import { matchFile } from "../utils/match-file";

/**
 * @param {string} specifier
 * @param {string} baseUrl
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {Promise<string | null>}
 */
const resolveBase = async (specifier, baseUrl, fs) => {
    const filePath = path.resolve(baseUrl, specifier);

    return await matchFile(filePath, fs);
};

export { resolveBase };
