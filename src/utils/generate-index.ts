import { FileIO, TILvertHTMLDocument } from "./index";

export default async function generateIndex(
  outputDirectory: string,
  htmlDoc: TILvertHTMLDocument,
  links?: Array<string>
) {
  await FileIO.deleteFile(FileIO.join(outputDirectory, "index.html"));

  if (!links) {
    links = (await FileIO.getFiles(outputDirectory, "html")).map((file) => {
      const segments = FileIO.split(file);
      segments.shift();
      return FileIO.join(...segments);
    });
  }

  const list = links.reduce((accumulator, file) => {
    const link = TILvertHTMLDocument.createTag(
      "a",
      FileIO.parsePath(file).name,
      { href: file }
    );
    const listItem = TILvertHTMLDocument.createTag("li", link);
    return `${accumulator}${listItem}`;
  }, "");

  htmlDoc.appendToBody(TILvertHTMLDocument.createTag("ul", list));

  outputDirectory = FileIO.join(outputDirectory, "index.html");

  const written = await FileIO.writeFile(outputDirectory, htmlDoc.renderHTML());

  if (!written) {
    console.error(`Error: Unable to write file. ${outputDirectory}`);
  }
}
