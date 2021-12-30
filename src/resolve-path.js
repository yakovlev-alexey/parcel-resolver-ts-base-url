import path from "path";

/**
 * @param {string} specifier
 * @param {import('./parse-paths').Path} matchedPath
 * @param {string} baseUrl
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {string | null}
 */
const resolvePath = async (specifier, matchedPath, baseUrl, fs) => {
  const strippedMatch = matchedPath.match.replace("*", "");

  const wildcard = specifier.replace(strippedMatch, "");

  for (const resolve of matchedPath.resolve) {
    const filePath = path.resolve(baseUrl, resolve.replace("*", wildcard));

    if (await fs.exists(filePath)) {
      return filePath;
    }
  }

  return null;
};

export { resolvePath };
