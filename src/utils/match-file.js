import path from "path";

import { POSSIBLE_EXTENSIONS } from "../constants";

import { getPackage } from "./get-package";

/**
 * @param {string} matchedPath
 * @param {import('@parcel/fs').FileSystem} fs
 * @param {string[]} extensions
 */
const matchFile = async (matchedPath, fs, extensions = POSSIBLE_EXTENSIONS) => {
    const exists = await fs.exists(matchedPath);

    if (!exists) {
        return null;
    }

    const stat = await fs.stat(matchedPath);
    if (stat.isDirectory()) {
        const pkg = await getPackage();

        const main = pkg && (pkg.main || pkg.module);
        if (main) {
            return path.resolve(matchedPath, main);
        }
    }

    const filePath = stat.isDirectory()
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
