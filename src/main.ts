#!/usr/bin/env node
import {
  processFile,
  generateIndex,
  FileIO,
  TILvertHTMLDocument,
} from "./utils";
import {
  FileProcessor,
  TextProcessingStrategy,
  MarkdownProcessingStrategy,
} from "./utils/file-processor";
import { Command } from "./helpers";

async function main() {
  Command.parse(process.argv);
  const options = Command.opts();
  const inputList = Command.args;
  const htmlDoc = new TILvertHTMLDocument();
  const processor = new FileProcessor(htmlDoc);

  htmlDoc.setTitle(options.title);
  htmlDoc.setLanguage(options.language);
  htmlDoc.addStylesheet(options.stylesheet);

  const meta = [
    { key: "author", value: options.author },
    { key: "description", value: options.description },
    { key: "keywords", value: options.keywords },
    { key: "rating", value: options.rating },
    { key: "robots", value: options.robots },
    { key: "generator", value: options.generator },
    { key: "theme-color", value: options.themeColor },
  ];
  meta.forEach((tag) => {
    if (tag.value) {
      htmlDoc.appendMetaTag(tag.key, tag.value);
    }
  });

  await Promise.all(
    inputList.map(async (input) => {
      let extension = options.extension;
      let files = [];
      let isDirectory: boolean | null = null;
      if (await FileIO.isFile(input)) {
        console.log(`Input File: ${FileIO.resolve(input)}`);
        extension = FileIO.parsePath(input).ext;
        files.push(input);
        isDirectory = false;
      } else if (await FileIO.isDirectory(input)) {
        console.log(`Input Directory: ${FileIO.resolve(input)}`);
        files = await FileIO.readDirectoryRecursive(input, extension);
        isDirectory = true;
      } else {
        console.error(`Error: Unable to read file/folder. <${input}>`);
        return;
      }

      switch (extension) {
        case ".txt":
        case "txt":
          console.log("Using TextProcessingStrategy");
          processor.setStrategy(new TextProcessingStrategy());
          break;
        case ".md":
        case "md":
          console.log("Using MarkdownProcessingStrategy");
          processor.setStrategy(new MarkdownProcessingStrategy());
          break;
        default:
      }

      await Promise.all(
        files.map(async (file) => {
          const parsedPath = FileIO.parsePath(file);
          const data = await FileIO.readFile(file);

          if (!data) {
            console.error("Error: Unable to read file.");
            if (!isDirectory) process.exit(1);
            else return;
          }

          processor.process(data);

          const written = await FileIO.writeFile(
            FileIO.join(options.output, `${parsedPath.name}.html`),
            htmlDoc.renderHTML()
          );

          if (!written) {
            console.error(
              `Error: Unable to write file. ${FileIO.join(
                options.output,
                `${parsedPath.name}.html`
              )}`
            );
          }
        })
      );
    })
  );

  generateIndex({
    outputDirectory: options.output,
    stylesheet: options.stylesheet,
    language: options.language,
    meta,
  });
  console.log(`Output directory: ${FileIO.resolve(options.output)}`);
}

main();
