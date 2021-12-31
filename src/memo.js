import path from "path";

const createMemoizeTsConfig = () => {
    const memo = {};

    /**
     * @param {string} projectRoot
     * @param {import('@parcel/fs').FileSystem} fs
     * @returns {Record<string, unknown>}
     */
    return async (projectRoot, fs) => {
        if (memo[projectRoot] !== null) {
            return memo[projectRoot];
        }

        const tsConfigPath = path.join(options.projectRoot, "tsconfig.json");
        const tsConfigContent = await fs.readFile(tsConfigPath);

        return (memo[projectRoot] = JSON.parse(tsConfigContent));
    };
};

export { createMemoizeTsConfig };
