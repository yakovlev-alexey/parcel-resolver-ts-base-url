import path from "path";

/**
 * @param {string} specifier
 * @param {string} baseUrl
 * @param {import('@parcel/fs').FileSystem} fs
 * @returns {string | null}
 */
const resolveBase = async (specifier, baseUrl, fs) => {
  const filePath = path.resolve(baseUrl, specifier);

  if (await fs.exists(filePath)) {
    return filePath;
  }

  return null;
};

export { resolveBase };
