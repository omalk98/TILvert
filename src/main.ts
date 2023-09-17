#!/usr/bin/env node
import { processFile, generateIndex, FileIO } from "./utils";
import { Command } from "./helpers";

async function main() {
  Command.parse(process.argv);
  const options = Command.opts();
  const inputList = Command.args;
  console.log(inputList);

  const meta = [
    { key: "author", value: options.author },
    { key: "description", value: options.description },
    { key: "keywords", value: options.keywords },
    { key: "rating", value: options.rating },
    { key: "robots", value: options.robots },
    { key: "generator", value: options.generator },
    { key: "theme-color", value: options.themeColor },
  ];

  await Promise.all(
    inputList.map(async (input) => {
      if (await FileIO.isFile(input)) {
        console.log(`Input File: ${FileIO.resolve(input)}`);

        await processFile(
          input,
          options.title,
          options.stylesheet,
          options.output,
          options.extension,
          meta,
          true
        );
      } else if (await FileIO.isDirectory(input)) {
        console.log(`Input Directory: ${FileIO.resolve(input)}`);

        const files = await FileIO.readDirectoryRecursive(
          input,
          options.extension as string
        );

        for (let i = 0; i < files.length; i++) {
          await processFile(
            files[i] as string,
            options.title,
            options.stylesheet,
            options.output,
            options.extension,
            meta
          );
        }
      } else {
        console.error(`Error: Unable to read file/folder. <${input}>`);
        return;
      }
    })
  );

  generateIndex(options.output, options.stylesheet, meta);
  console.log(`Output directory: ${FileIO.resolve(options.output)}`);
}

main();
