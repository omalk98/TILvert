import TILvertHTMLDocument from "../html-doc";

export interface IFileProcessor {
  process: (
    data: string,
    htmlDocument: TILvertHTMLDocument
  ) => TILvertHTMLDocument;
}

export class FileProcessingStrategy implements IFileProcessor {
  constructor() {}

  protected split(data: string): Array<string> {
    return data.split(/\r?\n\r?\n/);
  }

  protected extractTitle(segments: Array<string>): string {
    let title = "";
    if (segments[1]?.match(/^\r?\n/)) {
      title = segments[0]?.replace(/\r?\n/, "") as string;
      segments.shift();
    }
    return title;
  }

  public process(
    data: string,
    htmlDocument: TILvertHTMLDocument
  ): TILvertHTMLDocument {
    const segments = this.split(data);
    const title = this.extractTitle(segments);
    htmlDocument.appendToHead(TILvertHTMLDocument.createTag("title", title));
    htmlDocument.appendToBody(TILvertHTMLDocument.createTag("h1", title));
    segments.forEach((segment) => {
      htmlDocument.appendToBody(TILvertHTMLDocument.createTag("p", segment));
    });
    return htmlDocument;
  }
}

export class FileProcessor implements IFileProcessor {
  private HTMLDocument: TILvertHTMLDocument | undefined;
  private ProcessingStrategy: IFileProcessor;

  constructor(document?: TILvertHTMLDocument, processor?: IFileProcessor) {
    this.HTMLDocument = document || undefined;
    this.ProcessingStrategy = processor || new FileProcessingStrategy();
  }

  public setStrategy(processor: IFileProcessor): void {
    this.ProcessingStrategy = processor;
  }

  public setHTMLDocument(document: TILvertHTMLDocument): void {
    this.HTMLDocument = document;
  }

  public process(data: string): TILvertHTMLDocument {
    if (!this.HTMLDocument) {
      console.error("Error: HTMLDocument is undefined.");
      process.exit(1);
    }
    return this.ProcessingStrategy.process(data, this.HTMLDocument);
  }
}

import MarkdownProcessingStrategy from "./markdown";
import TextProcessingStrategy from "./text";

export { MarkdownProcessingStrategy, TextProcessingStrategy };
