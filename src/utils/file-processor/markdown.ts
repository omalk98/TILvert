import TILvertHTMLDocument from "../html-doc";
import { FileProcessingStrategy } from "./index";

export default class MarkdownProcessingStrategy extends FileProcessingStrategy {
  protected convertLinks(text: string): string {
    const markdownLinkRegex = /\[([^\]]+)\]\(([^\)]+)\)/;
    const markdownLinks = text.match(new RegExp(markdownLinkRegex, "g"));
    if (markdownLinks && markdownLinks.length > 0) {
      markdownLinks.forEach((link) => {
        const linkGroup = link.match(markdownLinkRegex);

        if (linkGroup) {
          const [mdLink, mdText, mdURL] = linkGroup;
          const anchorTag = TILvertHTMLDocument.createTag("a", mdText, {
            href: mdURL,
            target: "_blank",
          });
          text = text.replace(mdLink, anchorTag);
        }
      });
    }
    return text;
  }

  protected convertCodeBlocks(text: string): string {
    const markdownCodeBlockRegex = /```(\w+)?\s*?((?:.|\r?\n)*?)```/;
    const markdownCodeBlocks = text.match(
      new RegExp(markdownCodeBlockRegex, "g")
    );
    if (markdownCodeBlocks && markdownCodeBlocks.length > 0) {
      markdownCodeBlocks.forEach((codeBlock) => {
        const codeBlockGroup = codeBlock.match(markdownCodeBlockRegex);

        if (codeBlockGroup) {
          const [mdCodeBlock, mdLanguage, mdCode] = codeBlockGroup;
          const codeTag = TILvertHTMLDocument.createTag("code", mdCode, {
            class: mdLanguage,
          });
          const preTag = TILvertHTMLDocument.createTag("pre", codeTag);
          text = text.replace(mdCodeBlock, preTag);
        }
      });
    }
    return text;
  }

  protected convertInlineCodeBlocks(text: string): string {
    const markdownInlineCodeBlockRegex = /`([^`]+)`/;
    const markdownInlineCodeBlocks = text.match(
      new RegExp(markdownInlineCodeBlockRegex, "g")
    );
    if (markdownInlineCodeBlocks && markdownInlineCodeBlocks.length > 0) {
      markdownInlineCodeBlocks.forEach((codeBlock) => {
        const codeBlockGroup = codeBlock.match(markdownInlineCodeBlockRegex);

        if (codeBlockGroup) {
          const [mdCodeBlock, mdCode] = codeBlockGroup;
          const codeTag = TILvertHTMLDocument.createTag("code", mdCode);
          text = text.replace(mdCodeBlock, codeTag);
        }
      });
    }
    return text;
  }

  protected convertHr(text: string): string {
    const markdownHrRegex = /^\s*?---\s*$/;
    const markdownHrs = text.match(new RegExp(markdownHrRegex, "g"));
    if (markdownHrs && markdownHrs.length > 0) {
      markdownHrs.forEach((hr) => {
        text = text.replace(hr, TILvertHTMLDocument.createTag("hr"));
      });
    }
    return text;
  }

  public process(
    data: string,
    htmlDocument: TILvertHTMLDocument
  ): TILvertHTMLDocument {
    data = this.convertCodeBlocks(data);

    data = this.convertHr(data);

    const segments = this.split(data);
    if (htmlDocument.getTitle() === "") {
      const title = this.extractTitle(segments);
      htmlDocument.setTitle(title);
    }

    segments.forEach((segment) => {
      segment = this.convertLinks(segment);
      segment = this.convertInlineCodeBlocks(segment);
      htmlDocument.appendToBody(TILvertHTMLDocument.createTag("p", segment));
    });
    return htmlDocument;
  }
}
