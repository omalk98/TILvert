"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseHTMLTest = exports.FileProcessingStrategy = void 0;
const html_doc_1 = __importDefault(require("../html-doc"));
class FileProcessingStrategy {
    split(data) {
        return data.split(/\r?\n\r?\n/);
    }
    extractTitle(segments) {
        var _a, _b, _c;
        let title = "";
        if ((_a = segments[1]) === null || _a === void 0 ? void 0 : _a.match(/^\r?\n/)) {
            title = (_b = segments[0]) === null || _b === void 0 ? void 0 : _b.replace(/\r?\n/, "");
            segments.shift();
            if ((_c = segments[0]) === null || _c === void 0 ? void 0 : _c.match(/^\r?\n/)) {
                segments[0] = segments[0].substring(segments[0].match(/^\r\n/) ? 2 : 1);
            }
        }
        return title;
    }
    process(data, htmlDocument) {
        const segments = this.split(data);
        if (!htmlDocument.getTitle()) {
            const title = this.extractTitle(segments);
            htmlDocument.setTitle(title);
        }
        segments.forEach((segment) => {
            htmlDocument.appendToBody(html_doc_1.default.createTag("p", segment));
        });
        return htmlDocument;
    }
}
exports.FileProcessingStrategy = FileProcessingStrategy;
class FileProcessor {
    constructor(document, processor) {
        this.HTMLDocument = document !== null && document !== void 0 ? document : undefined;
        this.ProcessingStrategy = processor !== null && processor !== void 0 ? processor : new FileProcessingStrategy();
    }
    setStrategy(processor) {
        this.ProcessingStrategy = processor;
    }
    setHTMLDocument(document) {
        this.HTMLDocument = document;
    }
    process(data) {
        if (!this.HTMLDocument) {
            console.error("Error: HTMLDocument is undefined.");
            process.exit(1);
        }
        return this.ProcessingStrategy.process(data, this.HTMLDocument);
    }
}
exports.default = FileProcessor;
const baseHTMLTest = ({ head = [], body = [], }) => {
    return (`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
        head.join("") +
        "</head>\n<body>\n" +
        body.join("") +
        "</body>\n</html>\n");
};
exports.baseHTMLTest = baseHTMLTest;
//# sourceMappingURL=base.js.map