export default class TILvertHTMLDocument {
  private head: Array<string>;
  private body: Array<string>;
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
  }

  private static processAttributes(attributes: Object | undefined) {
    if (!attributes) return "";
    return Object.entries(attributes).reduce(
      (accumulator, [key, value]) => `${accumulator} ${key}="${value}"`,
      ""
    );
  }

  private static baseHTML({
    head,
    body,
  }: {
    head: Array<string>;
    body: Array<string>;
  }): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${head.join("")}
</head>
<body>
${body.join("")}
</body>
</html>
`;
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
    });
  }

  public static createTag(
    name: string,
    content?: string,
    attributes?: Object
  ): string {
    return this.self_closing_tags.includes(name)
      ? `<${name}${this.processAttributes(attributes)} />\n`
      : `<${name}${this.processAttributes(attributes)}>${content}</${name}>\n`;
  }
}
