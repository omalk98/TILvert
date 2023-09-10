#!/usr/bin/env node
import { processArguments, FileIO, TILvertHTMLDocument } from "./utils";
import { Info } from "./helpers";

async function processFile(
  path: string,
  title: string = "",
  stylesheet: string | null,
  outputPath: string,
  extension: string,
  meta?: Array<{ key: string; value: string | boolean | null | undefined }>,
  fileOnly: boolean = false
) {
  const htmlDoc = new TILvertHTMLDocument();

  const data = await FileIO.readFile(path);
  if (!data) {
    console.error("Error: Unable to read file.");
    process.exit(1);
  }
  const segments = data.split(/\r?\n\r?\n/);

  if (!title && segments[1].match(/^\r?\n/)) {
    title = segments[0].replace(/\r?\n/, "");
    segments.shift();
  } else if (!title) {
    title = path.split("/").pop()?.split(".")[0] ?? "Untitled";
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
    htmlDoc.appendToBody(
      TILvertHTMLDocument.createTag("p", segment.replace(/\n|\r/, ""))
    );
  });

  if (fileOnly) {
    path = path.split("/").pop() as string;
  }

  path = path.replace(new RegExp(`.${extension}$`, "i"), ".html");

  const written = await FileIO.writeFile(
    FileIO.join(outputPath, path),
    htmlDoc.renderHTML()
  );

  if (!written) {
    console.error(
      `Error: Unable to write file. ${FileIO.join(outputPath, path)}`
    );
  }
}

async function main() {
  const [argMap, input] = processArguments(process.argv.slice(2));

  if (argMap.get("isHelp")) {
    Info.getHelp();
    process.exit(0);
  }
  if (argMap.get("isVersion")) {
    Info.getVersion();
    process.exit(0);
  }

  const meta = [
    { key: "author", value: argMap.get("author") },
    { key: "description", value: argMap.get("description") },
    { key: "keywords", value: argMap.get("keywords") },
    { key: "rating", value: argMap.get("rating") },
    { key: "robots", value: argMap.get("robots") },
    { key: "generator", value: argMap.get("generator") },
    { key: "theme-color", value: argMap.get("theme-color") },
  ];

  if (await FileIO.isFile(input)) {
    processFile(
      input,
      argMap.get("title") as string,
      argMap.get("stylesheet") as string,
      argMap.get("outputDirectory") as string,
      argMap.get("extension") as string,
      meta,
      true
    );
  } else if (await FileIO.isDirectory(input)) {
    const outDir = argMap.get("outputDirectory") as string;
    const success = await FileIO.replicateDirectoryStructure(input, outDir);
    if (!success) {
      console.error("Error: Unable to replicate directory structure.");
    }

    const files = await FileIO.readDirectoryRecursive(
      input,
      argMap.get("extension") as string
    );
    console.log(files);
    files.forEach((file) => {
      processFile(
        file,
        argMap.get("title") as string,
        argMap.get("stylesheet") as string,
        outDir,
        argMap.get("extension") as string,
        meta
      );
    });
  }
}

main();
