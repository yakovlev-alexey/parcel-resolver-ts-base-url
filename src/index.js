import path from "path";

import { Resolver } from "@parcel/plugin";

import { getTsConfig } from "./utils/get-ts-config";

import { matchPath } from "./steps/match-path";
import { parsePaths } from "./steps/parse-paths";
import { resolveBase } from "./steps/resolve-base";
import { resolvePath } from "./steps/resolve-path";

const memoizeTsConfig = createMemoizeTsConfig();

export default new Resolver({
    async resolve({ specifier, dependency, options }) {
        const isTypescriptImport = /\.tsx?$/g.test(dependency.resolveFrom);

        if (!isTypescriptImport) {
            return null;
        }

        try {
            const tsConfig = await getTsConfig(
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
