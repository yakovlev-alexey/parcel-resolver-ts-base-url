import path from "path";

import { matchFile } from "../utils/match-file";

/**
 * @param {import('@parcel/fs').FileSystem} fs
 * @param {string} specifier
 * @param {import('./parse-paths').Path} matchedPath
 * @param {string} baseUrl
 * @returns {Promise<string | null>}
 */
const resolvePath = async (fs, specifier, matchedPath, baseUrl) => {
    const strippedMatch = matchedPath.match.replace("*", "");

    const wildcard = specifier.replace(strippedMatch, "");

    const resolves =
        typeof matchedPath.resolve === "string"
            ? [matchedPath.resolve]
            : matchedPath.resolve;

    for (const resolve of resolves) {
        const filePath = path.resolve(baseUrl, resolve.replace("*", wildcard));

        const matchedFile = await matchFile(fs, filePath);

        if (matchedFile) {
            return matchedFile;
        }
    }

    return null;
};

export { resolvePath };
