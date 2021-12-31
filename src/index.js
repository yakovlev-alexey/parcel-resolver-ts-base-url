import { Resolver } from "@parcel/plugin";

import { createMemoizeTsConfig } from "./memo";

import { matchPath } from "./match-path";
import { parsePaths } from "./parse-paths";
import { resolveBase } from "./resolve-base";
import { resolvePath } from "./resolve-path";

const memoizeTsConfig = createMemoizeTsConfig();

export default new Resolver({
    async resolve({ specifier, options }) {
        try {
            const tsConfig = await memoizeTsConfig(
                options.projectRoot,
                options.inputFS
            );

            const rawBaseUrl = tsConfig?.compilerOptions?.baseUrl || ".";
            const rawPaths = tsConfig?.compilerOptions?.paths;

            if (!rawBaseUrl && !rawPaths) {
                return null;
            }

            const baseUrl = path.resolve(options.projectRoot, rawBaseUrl);
            const paths = parsePaths(rawPaths);

            const matchedPath = matchPath(specifier, paths);

            if (matchedPath !== null) {
                const resolved = await resolvePath(
                    specifier,
                    matchedPath,
                    baseUrl,
                    options.inputFS
                );

                return {
                    filePath: resolved,
                    invalidateOnFileChange: [resolved],
                };
            }

            const resolvedFromBase = await resolveBase(
                specifier,
                baseUrl,
                options.inputFS
            );

            if (resolvedFromBase !== null) {
                return {
                    filePath: resolvedFromBase,
                    invalidateOnFileChange: [resolvedFromBase],
                };
            }
        } catch (err) {}

        return null;
    },
});
