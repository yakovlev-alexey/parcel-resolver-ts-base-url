import path from "path";

import { POSSIBLE_EXTENSIONS } from "../constants";

import { getPackage } from "./get-package";

/**
 * @param {import('@parcel/fs').FileSystem} fs
 * @param {string} matchedPath
 * @param {string[]} extensions
 * @returns {Promise<string | null>}
 */
const matchFile = async (fs, matchedPath, extensions = POSSIBLE_EXTENSIONS) => {
    const exists = await fs.exists(matchedPath);

    const stat = exists && (await fs.stat(matchedPath));
    const isDirectory = stat && stat.isDirectory();

    if (exists) {
        if (!isDirectory) {
            return matchedPath;
        }

        const pkg = await getPackage(fs, matchedPath);

        const main = pkg && (pkg.main || pkg.module);
        if (typeof main === "string") {
            return path.resolve(matchedPath, main);
        }
    }

    const filePath = isDirectory
        ? path.resolve(matchedPath, "index")
        : matchedPath;

    for (const extension of extensions) {
        const completePath = `${filePath}.${extension}`;

        if (await fs.exists(completePath)) {
            return completePath;
        }
    }

    return null;
};

export { matchFile };
