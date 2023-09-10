"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TILvertHTMLDocument {
    constructor() {
        this.head = [];
        this.body = [];
    }
    static processAttributes(attributes) {
        if (!attributes)
            return "";
        return Object.entries(attributes).reduce((accumulator, [key, value]) => `${accumulator} ${key}="${value}"`, "");
    }
    static baseHTML({ head, body, }) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${head.join("")}
</head>
<body>
${body.join("")}
</body>
</html>
`;
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
