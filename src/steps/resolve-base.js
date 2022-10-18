import path from "path";

import { matchFile } from "../utils/match-file";

/**
 * @param {import('@parcel/fs').FileSystem} fs
 * @param {string} specifier
 * @param {string} baseUrl
 * @returns {Promise<string | null>}
 */
const resolveBase = async (fs, specifier, baseUrl) => {
    const filePath = path.resolve(baseUrl, specifier);

    return await matchFile(fs, filePath);
};

export { resolveBase };
