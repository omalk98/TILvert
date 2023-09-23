import { FileIO, TILvertHTMLDocument } from "./index";

export default async function generateIndex(
  outputDirectory: string,
  htmlDoc: TILvertHTMLDocument
) {
  await FileIO.deleteFile(FileIO.join(outputDirectory, "index.html"));

  const files = await FileIO.readDirectoryRecursive(outputDirectory, "html");

  const list = files.reduce((accumulator, file) => {
    const output = file.split("/");
    output.shift();

    const link = TILvertHTMLDocument.createTag(
      "a",
      FileIO.parsePath(file).name,
      {
        href: FileIO.join(...output),
      }
    );
    const listItem = TILvertHTMLDocument.createTag("li", link);
    return `${accumulator}${listItem}`;
  }, "");

  htmlDoc.appendToBody(TILvertHTMLDocument.createTag("ul", list));

  const indexOutDir = outputDirectory.split(FileIO.separator);
  indexOutDir.shift();
  outputDirectory = FileIO.join(...indexOutDir, "index.html");

  const written = await FileIO.writeFile(outputDirectory, htmlDoc.renderHTML());

  if (!written) {
    console.error(`Error: Unable to write file. ${outputDirectory}`);
  }
}
