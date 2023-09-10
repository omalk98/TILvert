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
exports.generateIndex = exports.processFile = void 0;
const index_1 = require("./index");
function processFile(path, title = "", stylesheet, outputPath, extension, meta, fileOnly = false) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const htmlDoc = new index_1.TILvertHTMLDocument();
        const data = yield index_1.FileIO.readFile(path);
        if (!data) {
            console.error("Error: Unable to read file.");
            process.exit(1);
        }
        const segments = data.split(/\r?\n\r?\n/);
        if (!title && segments[1].match(/^\r?\n/)) {
            title = segments[0].replace(/\r?\n/, "");
            segments.shift();
        }
        else if (!title) {
            title = (_b = (_a = path.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) !== null && _b !== void 0 ? _b : "Untitled";
        }
        htmlDoc.appendToHead(index_1.TILvertHTMLDocument.createTag("title", title));
        htmlDoc.appendToBody(index_1.TILvertHTMLDocument.createTag("h1", title));
        if (stylesheet) {
            htmlDoc.appendToHead(index_1.TILvertHTMLDocument.createTag("link", "", {
                rel: "stylesheet",
                href: stylesheet,
                type: "text/css",
            }));
        }
        meta === null || meta === void 0 ? void 0 : meta.forEach((tag) => {
            if (tag.value) {
                htmlDoc.appendToHead(index_1.TILvertHTMLDocument.createTag("meta", "", {
                    name: tag.key,
                    content: tag.value,
                }));
            }
        });
        segments.forEach((segment) => {
            htmlDoc.appendToBody(index_1.TILvertHTMLDocument.createTag("p", segment.replace(/\n|\r/, "")));
        });
        if (fileOnly) {
            path = path.split("/").pop();
        }
        path = path.replace(new RegExp(`.${extension}$`, "i"), ".html");
        const written = yield index_1.FileIO.writeFile(index_1.FileIO.join(outputPath, path), htmlDoc.renderHTML());
        if (!written) {
            console.error(`Error: Unable to write file. ${index_1.FileIO.join(outputPath, path)}`);
        }
    });
}
exports.processFile = processFile;
function generateIndex(outputDirectory, stylesheet, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlDoc = new index_1.TILvertHTMLDocument();
        htmlDoc.appendToHead(index_1.TILvertHTMLDocument.createTag("title", "TILvert Index"));
        htmlDoc.appendToBody(index_1.TILvertHTMLDocument.createTag("h1", "TILvert Index"));
        if (stylesheet) {
            htmlDoc.appendToHead(index_1.TILvertHTMLDocument.createTag("link", "", {
                rel: "stylesheet",
                href: stylesheet,
                type: "text/css",
            }));
        }
        meta === null || meta === void 0 ? void 0 : meta.forEach((tag) => {
            if (tag.value) {
                htmlDoc.appendToHead(index_1.TILvertHTMLDocument.createTag("meta", "", {
                    name: tag.key,
                    content: tag.value,
                }));
            }
        });
        yield index_1.FileIO.deleteFile(index_1.FileIO.join(outputDirectory, "index.html"));
        const files = yield index_1.FileIO.readDirectoryRecursive(outputDirectory, "html");
        const list = files.reduce((accumulator, file) => {
            var _a;
            const output = file.split("/");
            output.shift();
            const link = index_1.TILvertHTMLDocument.createTag("a", (_a = file.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0], {
                href: index_1.FileIO.join(...output),
            });
            const listItem = index_1.TILvertHTMLDocument.createTag("li", link);
            return `${accumulator}${listItem}`;
        }, "");
        htmlDoc.appendToBody(index_1.TILvertHTMLDocument.createTag("ul", list));
        const outDir = outputDirectory.split("/");
        outDir.shift();
        const written = yield index_1.FileIO.writeFile(index_1.FileIO.join(...outDir, "index.html"), htmlDoc.renderHTML());
        if (!written) {
            console.error(`Error: Unable to write file. ${index_1.FileIO.join(outputDirectory, "index.html")}`);
        }
    });
}
exports.generateIndex = generateIndex;
