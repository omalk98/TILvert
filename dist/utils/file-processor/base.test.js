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
function createProcessor() {
    return new base_1.default(new html_doc_1.default());
}
(0, vitest_1.describe)("Tests File Processor with Base Strategy", () => {
    (0, vitest_1.test)("Process Line of Text", () => {
        const baseProcessor = createProcessor();
        const testText = "Hi There";
        (0, vitest_1.expect)(baseProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({ body: ["<p>Hi There</p>\n"] }));
    });
    (0, vitest_1.test)("Process Text Multi-line (Unix EOL)", () => {
        const baseProcessor = createProcessor();
        const testText = "Hi There\n\nThis is a test\n\nMaking sure everything works\neven with new lines";
        (0, vitest_1.expect)(baseProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: [
                "<p>Hi There</p>\n",
                "<p>This is a test</p>\n",
                "<p>Making sure everything works\neven with new lines</p>\n",
            ],
        }));
    });
    (0, vitest_1.test)("Process Text Multi-line (Windows EOL)", () => {
        const baseProcessor = createProcessor();
        const testText = "Hi There\r\n\r\nThis is a test\r\n\r\nMaking sure everything works\r\neven with new lines";
        (0, vitest_1.expect)(baseProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            body: [
                "<p>Hi There</p>\n",
                "<p>This is a test</p>\n",
                "<p>Making sure everything works\r\neven with new lines</p>\n",
            ],
        }));
    });
    (0, vitest_1.test)("Process with Title", () => {
        const baseProcessor = createProcessor();
        const testText = "Test Title\n\n\nThis page has a title";
        (0, vitest_1.expect)(baseProcessor.process(testText).renderHTML()).toBe((0, base_1.baseHTMLTest)({
            head: ["<title>Test Title</title>\n"],
            body: ["<h1>Test Title</h1>\n", "<p>This page has a title</p>\n"],
        }));
    });
});
//# sourceMappingURL=base.test.js.map