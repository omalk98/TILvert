import TILvertHTMLDocument from "../html-doc";

export interface IFileProcessor {
  process: (
    data: string,
    htmlDocument: TILvertHTMLDocument
  ) => TILvertHTMLDocument;
}

export class FileProcessingStrategy implements IFileProcessor {
  protected split(data: string): string[] {
    return data.split(/\r?\n\r?\n/);
  }

  protected extractTitle(segments: string[]): string {
    let title = "";
    if (segments[1]?.match(/^\r?\n/)) {
      title = segments[0]?.replace(/\r?\n/, "") as string;
      segments.shift();
      if (segments[0]?.match(/^\r?\n/)) {
        segments[0] = segments[0].substring(segments[0].match(/^\r\n/) ? 2 : 1);
      }
    }
    return title;
  }

  public process(
    data: string,
    htmlDocument: TILvertHTMLDocument
  ): TILvertHTMLDocument {
    const segments = this.split(data);
    if (!htmlDocument.getTitle()) {
      const title = this.extractTitle(segments);
      htmlDocument.setTitle(title);
    }
    segments.forEach((segment) => {
      htmlDocument.appendToBody(TILvertHTMLDocument.createTag("p", segment));
    });
    return htmlDocument;
  }
}

export default class FileProcessor implements IFileProcessor {
  private HTMLDocument: TILvertHTMLDocument | undefined;
  private ProcessingStrategy: IFileProcessor;

  constructor(document?: TILvertHTMLDocument, processor?: IFileProcessor) {
    this.HTMLDocument = document ?? undefined;
    this.ProcessingStrategy = processor ?? new FileProcessingStrategy();
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

export const baseHTMLTest = ({
  head = [],
  body = [],
}: {
  head?: string[];
  body?: string[];
}): string => {
  return (
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
    head.join("") +
    "</head>\n<body>\n" +
    body.join("") +
    "</body>\n</html>\n"
  );
};
