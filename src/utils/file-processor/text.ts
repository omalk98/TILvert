import TILvertHTMLDocument from "../html-doc";
import { FileProcessingStrategy } from "./base";

export default class TextProcessingStrategy extends FileProcessingStrategy {
  protected convertLinks(text: string): string {
    const httpLinkRegex = /(https?:\/\/\S+)/;
    const httpLinks = text.match(new RegExp(httpLinkRegex, "g"));
    httpLinks?.forEach((link) => {
      const anchorTag = TILvertHTMLDocument.createTag("a", link, {
        href: link,
        target: "_blank",
      });
      text = text.replace(link, anchorTag);
    });
    return text;
  }

  public override process(
    data: string,
    htmlDocument: TILvertHTMLDocument
  ): TILvertHTMLDocument {
    const segments = this.split(data);
    if (!htmlDocument.getTitle()) {
      const title = this.extractTitle(segments);
      htmlDocument.setTitle(title);
    }
    segments.forEach((segment) => {
      segment = this.convertLinks(segment);

      htmlDocument.appendToBody(TILvertHTMLDocument.createTag("p", segment));
    });
    return htmlDocument;
  }
}
