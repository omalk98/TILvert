#!/usr/bin/env node
import { processArguments, processFile, generateIndex, FileIO } from "./utils";
import { Info } from "./helpers";

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
    console.log(`Input File: ${FileIO.resolve(input)}`);
    console.log(
      `Output directory: ${FileIO.resolve(
        argMap.get("outputDirectory") as string
      )}`
    );

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
    console.log(`Input Directory: ${FileIO.resolve(input)}`);
    console.log(
      `Output directory: ${FileIO.resolve(
        argMap.get("outputDirectory") as string
      )}`
    );

    const files = await FileIO.readDirectoryRecursive(
      input,
      argMap.get("extension") as string
    );

    for (let i = 0; i < files.length; i++) {
      await processFile(
        files[i],
        argMap.get("title") as string,
        argMap.get("stylesheet") as string,
        argMap.get("outputDirectory") as string,
        argMap.get("extension") as string,
        meta
      );
    }
  }

  generateIndex(
    argMap.get("outputDirectory") as string,
    argMap.get("stylesheet") as string,
    meta
  );
}

main();
