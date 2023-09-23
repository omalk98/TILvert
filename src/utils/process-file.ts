import { FileIO, TILvertHTMLDocument } from "./index";

export async function generateIndex({
  outputDirectory,
  stylesheet,
  language,
  meta,
}: {
  outputDirectory: string;
  stylesheet: string | null;
  language: string;
  meta?: Array<{ key: string; value: string | boolean | null | undefined }>;
}) {
  const htmlDoc = new TILvertHTMLDocument();

  htmlDoc.appendToHead(TILvertHTMLDocument.createTag("title", "TILvert Index"));
  htmlDoc.appendToBody(TILvertHTMLDocument.createTag("h1", "TILvert Index"));

  if (stylesheet) {
    htmlDoc.appendToHead(
      TILvertHTMLDocument.createTag("link", "", {
        rel: "stylesheet",
        href: stylesheet as string,
        type: "text/css",
      })
    );
  }

  meta?.forEach((tag) => {
    if (tag.value) {
      htmlDoc.appendToHead(
        TILvertHTMLDocument.createTag("meta", "", {
          name: tag.key,
          content: tag.value,
        })
      );
    }
  });

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

  const outDir = outputDirectory.split("/");
  outDir.shift();

  htmlDoc.setLanguage(language);
  const written = await FileIO.writeFile(
    FileIO.join(...outDir, "index.html"),
    htmlDoc.renderHTML()
  );

  if (!written) {
    console.error(
      `Error: Unable to write file. ${FileIO.join(
        outputDirectory,
        "index.html"
      )}`
    );
  }
}
