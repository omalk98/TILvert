"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_doc_1 = __importDefault(require("../html-doc"));
const base_1 = require("./base");
class TextProcessingStrategy extends base_1.FileProcessingStrategy {
    convertLinks(text) {
        const httpLinkRegex = /(https?:\/\/\S+)/;
        const httpLinks = text.match(new RegExp(httpLinkRegex, "g"));
        httpLinks === null || httpLinks === void 0 ? void 0 : httpLinks.forEach((link) => {
            const anchorTag = html_doc_1.default.createTag("a", link, {
                href: link,
                target: "_blank",
            });
            text = text.replace(link, anchorTag);
        });
        return text;
    }
    process(data, htmlDocument) {
        const segments = this.split(data);
        if (!htmlDocument.getTitle()) {
            const title = this.extractTitle(segments);
            htmlDocument.setTitle(title);
        }
        segments.forEach((segment) => {
            segment = this.convertLinks(segment);
            htmlDocument.appendToBody(html_doc_1.default.createTag("p", segment));
        });
        return htmlDocument;
    }
}
exports.default = TextProcessingStrategy;
//# sourceMappingURL=text.js.map