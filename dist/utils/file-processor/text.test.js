"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const base_1 = __importStar(require("./base"));
const html_doc_1 = __importDefault(require("../html-doc"));
const text_1 = __importDefault(require("./text"));
function createProcessor() {
    return new base_1.default(new html_doc_1.default(), new text_1.default());
}
(0, vitest_1.describe)("Tests File Processor wih Text Strategy", () => {
    (0, vitest_1.test)("Process Line of Text", () => {
        const textProcessor = createProcessor();
        const testText = "Hi There";
        (0, vitest_1.expect)(textProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({ body: ["<p>Hi There</p>\n"] }));
    });
    (0, vitest_1.test)("Process Link", () => {
        const textProcessor = createProcessor();
        const testText = "https://example.com";
        (0, vitest_1.expect)(textProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: [
                // eslint-disable-next-line quotes, @typescript-eslint/quotes
                '<p><a href="https://example.com" target="_blank">https://example.com</a>\n</p>\n',
            ],
        }));
    });
    (0, vitest_1.test)("Process Section", () => {
        const textProcessor = createProcessor();
        const testText = "Test Title\n\n\nhi there, this is a test\n\nhttps://example.com\n\nThis page should have 3 paragraphs, an anchor tag, and a title + h1";
        (0, vitest_1.expect)(textProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            head: ["<title>Test Title</title>\n"],
            body: [
                "<h1>Test Title</h1>\n",
                "<p>hi there, this is a test</p>\n",
                // eslint-disable-next-line quotes, @typescript-eslint/quotes
                '<p><a href="https://example.com" target="_blank">https://example.com</a>\n</p>\n',
                "<p>This page should have 3 paragraphs, an anchor tag, and a title + h1</p>\n",
            ],
        }));
    });
});
//# sourceMappingURL=text.test.js.map