import { describe, expect, test } from "vitest";
import FileProcessor, { baseHTMLTest } from "./base";
import TILvertHTMLDocument from "../html-doc";
import MarkdownProcessingStrategy from "./markdown";

function createProcessor(): FileProcessor {
  return new FileProcessor(
    new TILvertHTMLDocument(),
    new MarkdownProcessingStrategy()
  );
}

describe("Tests File Processor wih Markdown Strategy", () => {
  test("Process Line of Text", () => {
    const markdownProcessor = createProcessor();
    const testText = "Hi There";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({ body: ["<p>Hi There</p>\n"] })
    );
  });

  test("Process Bold Line of Text", () => {
    const markdownProcessor = createProcessor();
    const testText = "**Hi There**";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({ body: ["<p><strong>Hi There</strong>\n</p>\n"] })
    );
  });

  test("Process Italic Line of Text", () => {
    const markdownProcessor = createProcessor();
    const testText = "*Hi There*";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({ body: ["<p><em>Hi There</em>\n</p>\n"] })
    );
  });

  test("Process Horizontal Rule", () => {
    const markdownProcessor = createProcessor();
    const testText = "---";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: ["<p><hr />\n</p>\n"],
      })
    );
  });

  test("Process Link", () => {
    const markdownProcessor = createProcessor();
    const testText = "[Hi There](https://example.com)";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: [
          // eslint-disable-next-line quotes, @typescript-eslint/quotes
          '<p><a href="https://example.com" target="_blank">Hi There</a>\n</p>\n',
        ],
      })
    );
  });

  test("Process Code Block", () => {
    const markdownProcessor = createProcessor();
    const testText = "```javascript\nconst a = 1;\n```";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: [
          // eslint-disable-next-line quotes, @typescript-eslint/quotes
          '<p><pre><code class="javascript">\nconst a = 1;\n</code>\n</pre>\n</p>\n',
        ],
      })
    );
  });

  test("Process Inline Code Block", () => {
    const markdownProcessor = createProcessor();
    const testText = "`const a = 1;`";

    expect(markdownProcessor.process(testText).renderHTML()).toBe(
      baseHTMLTest({
        body: ["<p><code>const a = 1;</code>\n</p>\n"],
      })
    );
  });
});
