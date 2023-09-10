#!/usr/bin/env node
import { processArguments, processFile, FileIO } from "./utils";
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
    console.log(`Output directory: ${outDir}`);
    const success = await FileIO.replicateDirectoryStructure(input, outDir);
    if (!success) {
      console.error("Error: Unable to replicate directory structure.");
    }

    const files = await FileIO.readDirectoryRecursive(
      input,
      argMap.get("extension") as string
    );

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
