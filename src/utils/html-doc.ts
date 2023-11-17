export default class TILvertHTMLDocument {
  private readonly head: string[];
  private readonly body: string[];
  private title: string;
  private language: string;
  private readonly meta: string[];
  private static readonly self_closing_tags = [
    "img",
    "input",
    "br",
    "hr",
    "meta",
    "link",
  ];

  constructor() {
    this.head = [];
    this.body = [];
    this.title = "";
    this.meta = [];
    this.language = "en";
  }

  private static processAttributes(
    attributes: Record<string, string | undefined> | undefined
  ): string {
    if (!attributes) return "";
    return Object.entries(attributes).reduce(
      (accumulator, [key, value]) => `${accumulator} ${key}="${value}"`,
      ""
    );
  }

  private static baseHTML({
    head,
    body,
    meta,
    language,
    title,
  }: {
    head: string[];
    body: string[];
    meta: string[];
    language: string;
    title?: string;
  }): string {
    return (
      `<!DOCTYPE html>
<html lang="${language || "en"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n` +
      (meta.join("") && "\n") +
      (head.join("") && "\n") +
      (title ? this.createTag("title", title) : "") +
      "</head>\n<body>\n" +
      (title ? this.createTag("h1", title) : "") +
      body.join("") +
      "</body>\n</html>\n"
    );
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getTitle(): string {
    return this.title;
  }

  public setLanguage(language: string): void {
    this.language = language;
  }

  public appendMetaTag(name: string, content: string): void {
    if (!name || !content) return;
    this.meta.push(
      TILvertHTMLDocument.createTag("meta", "", { name, content })
    );
  }

  public addStylesheet(href: string): void {
    if (!href) return;
    this.appendToHead(
      TILvertHTMLDocument.createTag("link", "", {
        rel: "stylesheet",
        href,
        type: "text/css",
      })
    );
  }

  public appendToHead(content: string): void {
    this.head.push(content);
  }

  public appendToBody(content: string): void {
    this.body.push(content);
  }

  public renderHTML(): string {
    return TILvertHTMLDocument.baseHTML({
      head: this.head,
      body: this.body,
      meta: this.meta,
      language: this.language,
      title: this.title,
    });
  }

  public static createTag(
    name: string,
    content?: string,
    attributes?: Record<string, string | undefined>
  ): string {
    return this.self_closing_tags.includes(name)
      ? `<${name}${this.processAttributes(attributes)} />\n`
      : `<${name}${this.processAttributes(attributes)}>${content}</${name}>\n`;
  }
}
