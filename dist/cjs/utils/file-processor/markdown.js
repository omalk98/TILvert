"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_doc_1 = __importDefault(require("../html-doc"));
const base_1 = require("./base");
class MarkdownProcessingStrategy extends base_1.FileProcessingStrategy {
    convertLinks(text) {
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
        const markdownLinks = text.match(new RegExp(markdownLinkRegex, "g"));
        if (markdownLinks && markdownLinks.length > 0) {
            markdownLinks.forEach((link) => {
                const linkGroup = link.match(markdownLinkRegex);
                if (linkGroup) {
                    const [mdLink, mdText, mdURL] = linkGroup;
                    const anchorTag = html_doc_1.default.createTag("a", mdText, {
                        href: mdURL,
                        target: "_blank",
                    });
                    text = text.replace(mdLink, anchorTag);
                }
            });
        }
        return text;
    }
    convertCodeBlocks(text) {
        const markdownCodeBlockRegex = /```(\w+)?\s*?((?:.|\r?\n)*?)```/;
        const markdownCodeBlocks = text.match(new RegExp(markdownCodeBlockRegex, "g"));
        if (markdownCodeBlocks && markdownCodeBlocks.length > 0) {
            markdownCodeBlocks.forEach((codeBlock) => {
                const codeBlockGroup = codeBlock.match(markdownCodeBlockRegex);
                if (codeBlockGroup) {
                    const [mdCodeBlock, mdLanguage, mdCode] = codeBlockGroup;
                    const codeTag = html_doc_1.default.createTag("code", mdCode, {
                        class: mdLanguage,
                    });
                    const preTag = html_doc_1.default.createTag("pre", codeTag);
                    text = text.replace(mdCodeBlock, preTag);
                }
            });
        }
        return text;
    }
    convertItalic(text) {
        const markdownItalicRegex = /[*_]([^*_]+)[*_]/;
        const markdownItalicList = text.match(new RegExp(markdownItalicRegex, "g"));
        if (markdownItalicList && markdownItalicList.length > 0) {
            markdownItalicList.forEach((italic) => {
                const italicGroup = italic.match(markdownItalicRegex);
                if (italicGroup) {
                    const [mdItalic, mdText] = italicGroup;
                    const italicTag = html_doc_1.default.createTag("em", mdText);
                    text = text.replace(mdItalic, italicTag);
                }
            });
        }
        return text;
    }
    convertBold(text) {
        const markdownBoldRegex = /[*_]{2}([^_]+)[*_]{2}/;
        const markdownBoldList = text.match(new RegExp(markdownBoldRegex, "g"));
        if (markdownBoldList && markdownBoldList.length > 0) {
            markdownBoldList.forEach((bold) => {
                const boldGroup = bold.match(markdownBoldRegex);
                if (boldGroup) {
                    const [mdBold, mdText] = boldGroup;
                    const boldTag = html_doc_1.default.createTag("strong", mdText);
                    text = text.replace(mdBold, boldTag);
                }
            });
        }
        return text;
    }
    convertInlineCodeBlocks(text) {
        const markdownInlineCodeBlockRegex = /`([^`]+)`/;
        const markdownInlineCodeBlocks = text.match(new RegExp(markdownInlineCodeBlockRegex, "g"));
        if (markdownInlineCodeBlocks && markdownInlineCodeBlocks.length > 0) {
            markdownInlineCodeBlocks.forEach((codeBlock) => {
                const codeBlockGroup = codeBlock.match(markdownInlineCodeBlockRegex);
                if (codeBlockGroup) {
                    const [mdCodeBlock, mdCode] = codeBlockGroup;
                    const codeTag = html_doc_1.default.createTag("code", mdCode);
                    text = text.replace(mdCodeBlock, codeTag);
                }
            });
        }
        return text;
    }
    convertHr(text) {
        const markdownHrRegex = /^\s*---\s*$/;
        const markdownHrs = text.match(new RegExp(markdownHrRegex, "g"));
        if (markdownHrs && markdownHrs.length > 0) {
            markdownHrs.forEach((hr) => {
                text = text.replace(hr, html_doc_1.default.createTag("hr"));
            });
        }
        return text;
    }
    process(data, htmlDocument) {
        data = this.convertCodeBlocks(data);
        const segments = this.split(data);
        if (!htmlDocument.getTitle()) {
            const title = this.extractTitle(segments);
            htmlDocument.setTitle(title);
        }
        segments.forEach((segment) => {
            segment = this.convertLinks(segment);
            segment = this.convertInlineCodeBlocks(segment);
            segment = this.convertBold(segment);
            segment = this.convertItalic(segment);
            segment = this.convertHr(segment);
            htmlDocument.appendToBody(html_doc_1.default.createTag("p", segment));
        });
        return htmlDocument;
    }
}
exports.default = MarkdownProcessingStrategy;
//# sourceMappingURL=markdown.js.map