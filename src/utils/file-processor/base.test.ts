import { describe, expect, test } from "vitest";
import FileProcessor, { baseHTMLTest } from "./base";
import TILvertHTMLDocument from "../html-doc";

function createProcessor(): FileProcessor {
  return new FileProcessor(new TILvertHTMLDocument());
}

describe("Tests File Processor with Base Strategy", () => {
  test("Process Line of Text", () => {
    const baseProcessor = createProcessor();
    const testText = "Hi There";

    expect(baseProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({ body: ["<p>Hi There</p>\n"] })
    );
  });

  test("Process Text Multi-line (Unix EOL)", () => {
    const baseProcessor = createProcessor();
    const testText =
      "Hi There\n\nThis is a test\n\nMaking sure everything works\neven with new lines";

    expect(baseProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: [
          "<p>Hi There</p>\n",
          "<p>This is a test</p>\n",
          "<p>Making sure everything works\neven with new lines</p>\n",
        ],
      })
    );
  });

  test("Process Text Multi-line (Windows EOL)", () => {
    const baseProcessor = createProcessor();
    const testText =
      "Hi There\r\n\r\nThis is a test\r\n\r\nMaking sure everything works\r\neven with new lines";

    expect(baseProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: [
          "<p>Hi There</p>\n",
          "<p>This is a test</p>\n",
          "<p>Making sure everything works\r\neven with new lines</p>\n",
        ],
      })
    );
  });

  test("Process with Title", () => {
    const baseProcessor = createProcessor();
    const testText = "Test Title\n\n\nThis page has a title";

    expect(baseProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        head: ["<title>Test Title</title>\n"],
        body: ["<h1>Test Title</h1>\n", "<p>This page has a title</p>\n"],
      })
    );
  });
});
