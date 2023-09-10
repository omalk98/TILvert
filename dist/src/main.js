#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const helpers_1 = require("./helpers");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const [argMap, input] = (0, utils_1.processArguments)(process.argv.slice(2));
        if (argMap.get("isHelp")) {
            helpers_1.Info.getHelp();
            process.exit(0);
        }
        if (argMap.get("isVersion")) {
            helpers_1.Info.getVersion();
            process.exit(0);
        }
        const meta = [
            { key: "author", value: argMap.get("author") },
            { key: "description", value: argMap.get("description") },
            { key: "keywords", value: argMap.get("keywords") },
            { key: "rating", value: argMap.get("rating") },
            { key: "robots", value: argMap.get("robots") },
            { key: "generator", value: argMap.get("generator") },
            { key: "theme-color", value: argMap.get("theme-color") },
        ];
        if (yield utils_1.FileIO.isFile(input)) {
            (0, utils_1.processFile)(input, argMap.get("title"), argMap.get("stylesheet"), argMap.get("outputDirectory"), argMap.get("extension"), meta, true);
        }
        else if (yield utils_1.FileIO.isDirectory(input)) {
            const outDir = argMap.get("outputDirectory");
            console.log(`Output directory: ${outDir}`);
            const success = yield utils_1.FileIO.replicateDirectoryStructure(input, outDir);
            if (!success) {
                console.error("Error: Unable to replicate directory structure.");
            }
            const files = yield utils_1.FileIO.readDirectoryRecursive(input, argMap.get("extension"));
            for (let i = 0; i < files.length; i++) {
                yield (0, utils_1.processFile)(files[i], argMap.get("title"), argMap.get("stylesheet"), outDir, argMap.get("extension"), meta);
            }
        }
        (0, utils_1.generateIndex)(argMap.get("outputDirectory"), argMap.get("stylesheet"), meta);
    });
}
main();
