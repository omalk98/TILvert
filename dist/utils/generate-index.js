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
const index_1 = require("./index");
function generateIndex(outputDirectory, htmlDoc, links) {
    return __awaiter(this, void 0, void 0, function* () {
        yield index_1.FileIO.deleteFile(index_1.FileIO.join(outputDirectory, "index.html"));
        if (!links) {
            links = (yield index_1.FileIO.getFiles(outputDirectory, "html")).map((file) => {
                const segments = index_1.FileIO.split(file);
                segments.shift();
                return index_1.FileIO.join(...segments);
            });
        }
        const list = links.reduce((accumulator, file) => {
            const link = index_1.TILvertHTMLDocument.createTag("a", index_1.FileIO.parsePath(file).name, { href: file });
            const listItem = index_1.TILvertHTMLDocument.createTag("li", link);
            return `${accumulator}${listItem}`;
        }, "");
        htmlDoc.appendToBody(index_1.TILvertHTMLDocument.createTag("ul", list));
        outputDirectory = index_1.FileIO.join(outputDirectory, "index.html");
        const written = yield index_1.FileIO.writeFile(outputDirectory, htmlDoc.renderHTML());
        if (!written) {
            console.error(`Error: Unable to write file. ${outputDirectory}`);
        }
    });
}
exports.default = generateIndex;
//# sourceMappingURL=generate-index.js.map