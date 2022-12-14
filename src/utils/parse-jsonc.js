import * as JSONC from "jsonc-parser";

/**
 * @param {string} jsoncString
 * @returns {any}
 */
export function parseJsoncOrThrow(jsoncString){
    /**
     * @type {JSONC.ParseError[]}
    */
    const errors = [];
    const parsingResult = JSONC.parse(
        jsoncString,
        errors,
        {allowTrailingComma: true}
    );
    if(errors.length > 0){
        const {error: errorCode, offset} = errors[0];
        const errName = JSONC.printParseErrorCode(errorCode);
        throw new Error(
            `Cannot parse JSONC: got ${errName} at position ${offset}`
        );
    }
    return parsingResult
}
