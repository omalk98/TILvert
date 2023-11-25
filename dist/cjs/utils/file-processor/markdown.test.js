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
const markdown_1 = __importDefault(require("./markdown"));
function createProcessor() {
    return new base_1.default(new html_doc_1.default(), new markdown_1.default());
}
(0, vitest_1.describe)("Tests File Processor wih Markdown Strategy", () => {
    (0, vitest_1.test)("Process Line of Text", () => {
        const markdownProcessor = createProcessor();
        const testText = "Hi There";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({ body: ["<p>Hi There</p>\n"] }));
    });
    (0, vitest_1.test)("Process Bold Line of Text", () => {
        const markdownProcessor = createProcessor();
        const testText = "**Hi There**";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({ body: ["<p><strong>Hi There</strong>\n</p>\n"] }));
    });
    (0, vitest_1.test)("Process Italic Line of Text", () => {
        const markdownProcessor = createProcessor();
        const testText = "*Hi There*";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({ body: ["<p><em>Hi There</em>\n</p>\n"] }));
    });
    (0, vitest_1.test)("Process Horizontal Rule", () => {
        const markdownProcessor = createProcessor();
        const testText = "---";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: ["<p><hr />\n</p>\n"],
        }));
    });
    (0, vitest_1.test)("Process Link", () => {
        const markdownProcessor = createProcessor();
        const testText = "[Hi There](https://example.com)";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: [
                // eslint-disable-next-line quotes, @typescript-eslint/quotes
                '<p><a href="https://example.com" target="_blank">Hi There</a>\n</p>\n',
            ],
        }));
    });
    (0, vitest_1.test)("Process Code Block", () => {
        const markdownProcessor = createProcessor();
        const testText = "```javascript\nconst a = 1;\n```";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: [
                // eslint-disable-next-line quotes, @typescript-eslint/quotes
                '<p><pre><code class="javascript">\nconst a = 1;\n</code>\n</pre>\n</p>\n',
            ],
        }));
    });
    (0, vitest_1.test)("Process Inline Code Block", () => {
        const markdownProcessor = createProcessor();
        const testText = "`const a = 1;`";
        (0, vitest_1.expect)(markdownProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: ["<p><code>const a = 1;</code>\n</p>\n"],
        }));
    });
});
//# sourceMappingURL=markdown.test.js.map