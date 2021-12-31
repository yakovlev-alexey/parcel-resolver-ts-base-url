import path from "path";

import { matchFile } from "../utils/match-file";

/**
 * @param {string} specifier
 * @param {import('./parse-paths').Path} matchedPath
 * @param {string} baseUrl
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {Promise<string | null>}
 */
const resolvePath = async (specifier, matchedPath, baseUrl, fs) => {
    const strippedMatch = matchedPath.match.replace("*", "");

    const wildcard = specifier.replace(strippedMatch, "");

    const resolves =
        typeof matchedPath.resolve === "string"
            ? [matchedPath.resolve]
            : matchedPath.resolve;

    for (const resolve of resolves) {
        const filePath = path.resolve(baseUrl, resolve.replace("*", wildcard));

        const matchedFile = await matchFile(filePath, fs);

        if (matchedFile) {
            return matchedFile;
        }
    }

    return null;
};

export { resolvePath };
