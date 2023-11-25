"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TILvertHTMLDocument {
    constructor() {
        this.head = [];
        this.body = [];
        this.title = "";
        this.meta = [];
        this.language = "en";
    }
    static processAttributes(attributes) {
        if (!attributes)
            return "";
        return Object.entries(attributes).reduce((accumulator, [key, value]) => `${accumulator} ${key}="${value}"`, "");
    }
    static baseHTML({ head, body, meta, language, title, }) {
        return (`<!DOCTYPE html>
<html lang="${language || "en"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
            (meta.join("") && "\n") +
            (head.join("") && "\n") +
            (title ? this.createTag("title", title) : "") +
            "</head>\n<body>\n" +
            (title ? this.createTag("h1", title) : "") +
            body.join("") +
            "</body>\n</html>\n");
    }
    setTitle(title) {
        this.title = title;
    }
    getTitle() {
        return this.title;
    }
    setLanguage(language) {
        this.language = language;
    }
    appendMetaTag(name, content) {
        if (!name || !content)
            return;
        this.meta.push(TILvertHTMLDocument.createTag("meta", "", { name, content }));
    }
    addStylesheet(href) {
        if (!href)
            return;
        this.appendToHead(TILvertHTMLDocument.createTag("link", "", {
            rel: "stylesheet",
            href,
            type: "text/css",
        }));
    }
    appendToHead(content) {
        this.head.push(content);
    }
    appendToBody(content) {
        this.body.push(content);
    }
    renderHTML() {
        return TILvertHTMLDocument.baseHTML({
            head: this.head,
            body: this.body,
            meta: this.meta,
            language: this.language,
            title: this.title,
        });
    }
    static createTag(name, content, attributes) {
        return this.self_closing_tags.includes(name)
            ? `<${name}${this.processAttributes(attributes)} />\n`
            : `<${name}${this.processAttributes(attributes)}>${content}</${name}>\n`;
    }
}
TILvertHTMLDocument.self_closing_tags = [
    "img",
    "input",
    "br",
    "hr",
    "meta",
    "link",
];
exports.default = TILvertHTMLDocument;
//# sourceMappingURL=html-doc.js.map