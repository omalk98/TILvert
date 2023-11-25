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
const file_processor_1 = require("./utils/file-processor");
const helpers_1 = require("./helpers");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const Command = helpers_1.CLICommand.getInstance();
        if (process.argv.length < 3) {
            Command.outputHelp();
            process.exit(1);
        }
        const options = Command.getOptions();
        const inputList = Command.getArguments();
        const processor = new file_processor_1.FileProcessor();
        const meta = [
            { key: "author", value: options.author },
            { key: "description", value: options.description },
            { key: "keywords", value: options.keywords },
            { key: "rating", value: options.rating },
            { key: "robots", value: options.robots },
            { key: "generator", value: options.generator },
            { key: "theme-color", value: options.themeColor },
        ];
        yield Promise.all(inputList.map((input) => __awaiter(this, void 0, void 0, function* () {
            let extension = options.extension;
            let files = [];
            let isDirectory = null;
            if (yield utils_1.FileIO.isFile(input)) {
                console.log(`Input File: ${utils_1.FileIO.resolve(input)}`);
                extension = utils_1.FileIO.parsePath(input).ext;
                files.push(input);
                isDirectory = false;
            }
            else if (yield utils_1.FileIO.isDirectory(input)) {
                isDirectory = true;
                files = yield utils_1.FileIO.getFiles(input, extension);
                console.log(`Input Directory: ${utils_1.FileIO.resolve(input)}`);
                console.log("Input Files", files);
            }
            else {
                console.error(`Error: Unable to read file/folder. <${input}>`);
                return;
            }
            switch (extension) {
                case ".txt":
                case "txt":
                    console.log("Using TextProcessingStrategy");
                    processor.setStrategy(new file_processor_1.TextProcessingStrategy());
                    break;
                case ".md":
                case "md":
                    console.log("Using MarkdownProcessingStrategy");
                    processor.setStrategy(new file_processor_1.MarkdownProcessingStrategy());
                    break;
                default:
            }
            for (let i = 0; i < files.length; ++i) {
                const htmlDoc = new utils_1.TILvertHTMLDocument();
                htmlDoc.setTitle(options.title);
                htmlDoc.setLanguage(options.lang);
                htmlDoc.addStylesheet(options.stylesheet);
                meta.forEach((tag) => {
                    if (tag.value) {
                        htmlDoc.appendMetaTag(tag.key, tag.value);
                    }
                });
                processor.setHTMLDocument(htmlDoc);
                const parsedPath = utils_1.FileIO.parsePath(files[i]);
                const data = yield utils_1.FileIO.readFile(files[i]);
                if (!data) {
                    console.error("Error: Unable to read file.");
                    if (!isDirectory)
                        process.exit(1);
                    else
                        return;
                }
                processor.process(data);
                let outDir = "";
                if (isDirectory) {
                    outDir = utils_1.FileIO.join(options.output, parsedPath.dir, `${parsedPath.name}.html`);
                }
                else {
                    outDir = utils_1.FileIO.join(options.output, `${parsedPath.name}.html`);
                }
                const written = yield utils_1.FileIO.writeFile(outDir, htmlDoc.renderHTML());
                if (!written) {
                    console.error(`Error: Unable to write file. ${outDir}`);
                }
            }
        })));
        const index = new utils_1.TILvertHTMLDocument();
        index.setTitle(options.title);
        index.setLanguage(options.lang);
        index.addStylesheet(options.stylesheet);
        meta.forEach((tag) => {
            if (tag.value) {
                index.appendMetaTag(tag.key, tag.value);
            }
        });
        const links = (yield utils_1.FileIO.getFiles(options.output, "html")).map((file) => {
            const segments = utils_1.FileIO.split(file);
            segments.shift();
            return utils_1.FileIO.join(...segments);
        });
        yield (0, utils_1.generateIndex)(options.output, index, links);
        yield (0, utils_1.generateSitemap)(options.output, links.map((link) => ({ url: link })));
        console.log(`Output directory: ${utils_1.FileIO.resolve(options.output)}`);
    });
}
void main();
//# sourceMappingURL=main.js.map