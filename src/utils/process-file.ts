import { FileIO, TILvertHTMLDocument } from "./index";

export async function processFile({
  path,
  title = "",
  stylesheet,
  outputPath,
  language,
  extension,
  meta,
  fileOnly = false,
}: {
  path: string;
  title: string;
  stylesheet: string | null;
  outputPath: string;
  language: string;
  extension?: string;
  meta?: Array<{ key: string; value: string | boolean | null | undefined }>;
  fileOnly?: boolean;
}) {
  const htmlDoc = new TILvertHTMLDocument();

  const data = await FileIO.readFile(path);
  const parsedPath = FileIO.parsePath(path);
  if (!data) {
    console.error("Error: Unable to read file.");
    process.exit(1);
  }
  const segments = data.split(/\r?\n\r?\n/);

  if (!title && segments[1]?.match(/^\r?\n/)) {
    title = segments[0]?.replace(/\r?\n/, "") as string;
    segments.shift();
  } else if (!title) {
    title = parsedPath.name ?? "Untitled";
  }
  htmlDoc.appendToHead(TILvertHTMLDocument.createTag("title", title));
  htmlDoc.appendToBody(TILvertHTMLDocument.createTag("h1", title));

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

  segments.forEach((segment) => {
    if (extension === "md") {
      const markdownLinkRegex = /\[([^\]]+)\]\(([^\)]+)\)/;
      const markdownLinks = segment.match(new RegExp(markdownLinkRegex, "g"));

      if (markdownLinks && markdownLinks.length > 0) {
        markdownLinks.forEach((link) => {
          const linkGroup = link.match(markdownLinkRegex);

          if (linkGroup) {
            const [mdLink, mdText, mdURL] = linkGroup;
            const anchorTag = TILvertHTMLDocument.createTag("a", mdText, {
              href: mdURL,
              target: "_blank",
            });
            segment = segment.replace(mdLink, anchorTag);
          }
        });
      }
    }

    htmlDoc.appendToBody(TILvertHTMLDocument.createTag("p", segment));
  });

  if (fileOnly) {
    path = parsedPath.dir as string;
  }

  path = path.replace(
    new RegExp(`.${extension ?? parsedPath.ext.slice(1)}$`, "i"),
    ".html"
  );

  const written = await FileIO.writeFile(
    FileIO.join(outputPath, path),
    htmlDoc.renderHTML(language)
  );

  if (!written) {
    console.error(
      `Error: Unable to write file. ${FileIO.join(outputPath, path)}`
    );
  }
}

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

  const written = await FileIO.writeFile(
    FileIO.join(...outDir, "index.html"),
    htmlDoc.renderHTML(language)
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
