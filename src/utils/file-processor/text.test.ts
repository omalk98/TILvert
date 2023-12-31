import { describe, expect, test } from "vitest";
import FileProcessor, { baseHTMLTest } from "./base";
import TILvertHTMLDocument from "../html-doc";
import TextProcessingStrategy from "./text";

function createProcessor(): FileProcessor {
  return new FileProcessor(
    new TILvertHTMLDocument(),
    new TextProcessingStrategy()
  );
}

describe("Tests File Processor wih Text Strategy", () => {
  test("Process Line of Text", () => {
    const textProcessor = createProcessor();
    const testText = "Hi There";

    expect(textProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({ body: ["<p>Hi There</p>\n"] })
    );
  });

  test("Process Link", () => {
    const textProcessor = createProcessor();
    const testText = "https://example.com";

    expect(textProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: [
          // eslint-disable-next-line quotes, @typescript-eslint/quotes
          '<p><a href="https://example.com" target="_blank">https://example.com</a>\n</p>\n',
        ],
      })
    );
  });

  test("Process Section", () => {
    const textProcessor = createProcessor();
    const testText =
      "Test Title\n\n\nhi there, this is a test\n\nhttps://example.com\n\nThis page should have 3 paragraphs, an anchor tag, and a title + h1";

    expect(textProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        head: ["<title>Test Title</title>\n"],
        body: [
          "<h1>Test Title</h1>\n",
          "<p>hi there, this is a test</p>\n",
          // eslint-disable-next-line quotes, @typescript-eslint/quotes
          '<p><a href="https://example.com" target="_blank">https://example.com</a>\n</p>\n',
          "<p>This page should have 3 paragraphs, an anchor tag, and a title + h1</p>\n",
        ],
      })
    );
  });
});
