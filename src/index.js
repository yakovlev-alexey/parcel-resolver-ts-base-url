import path from "path";

import { Resolver } from "@parcel/plugin";

import { getTsConfig } from "./utils/get-ts-config";

import { matchPath } from "./steps/match-path";
import { parsePaths } from "./steps/parse-paths";
import { resolveBase } from "./steps/resolve-base";
import { resolvePath } from "./steps/resolve-path";

import { POSSIBLE_EXTENSION_REGEX } from "./constants";

export default new Resolver({
    async resolve({ specifier, dependency, options }) {
        const isJavascriptImport = POSSIBLE_EXTENSION_REGEX.test(
            dependency.resolveFrom || ""
        );

        if (!isJavascriptImport) {
            return null;
        }

        try {
            const { tsConfig, path: sourcePath } = await getTsConfig(
                options.inputFS,
                dependency.resolveFrom
                    ? path.dirname(dependency.resolveFrom)
                    : options.projectRoot,
                options.projectRoot
            );

            const rawBaseUrl = tsConfig.compilerOptions?.baseUrl;
            const rawPaths = tsConfig.compilerOptions?.paths;

            if (!rawBaseUrl && !rawPaths) {
                return null;
            }

            const baseUrl = path.resolve(sourcePath, rawBaseUrl || ".");
            const paths = parsePaths(rawPaths);

            const matchedPath = matchPath(specifier, paths);

            if (matchedPath !== null) {
                const resolved = await resolvePath(
                    options.inputFS,
                    specifier,
                    matchedPath,
                    baseUrl
                );

                if (!resolved) {
                    return null;
                }

                return {
                    filePath: resolved,
                    invalidateOnFileChange: [resolved],
                };
            }

            const resolvedFromBase = await resolveBase(
                options.inputFS,
                specifier,
                baseUrl
            );

            if (resolvedFromBase !== null) {
                return {
                    filePath: resolvedFromBase,
                    invalidateOnFileChange: [resolvedFromBase],
                };
            }
        } catch (err) {
            return {
                diagnostics: [
                    {
                        message:
                            err instanceof Error
                                ? err.message
                                : "Unknown error",
                        hints: [
                            "Check if a tsconfig.json file exists and has valid configuration in it",
                        ],
                    },
                ],
            };
        }

        return null;
    },
});
