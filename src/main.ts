#!/usr/bin/env node
import { generateIndex, FileIO, TILvertHTMLDocument } from "./utils";
import {
  FileProcessor,
  TextProcessingStrategy,
  MarkdownProcessingStrategy,
} from "./utils/file-processor";
import { Command } from "./helpers";
import toml from "toml";

async function main() {
  Command.parse(process.argv);
  const options = Command.opts();
  const inputList = Command.args;
  const processor = new FileProcessor();

  // check if config flag is used
  if (options.config) {
    // Read the configuration file
    const configData = await FileIO.readFile(options.config);
    if (!configData) {
      console.error("Error: Unable to read configuration file.");
      process.exit(1);
    }

    // parse the configuration file
    const config = toml.parse(configData);

    // override the options with the configuration file
    Object.keys(config).forEach((key) => {
      if (key in options) {
        options[key] = config[key];
      }
    });
  }

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
      console.log(files);

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

      for (let i = 0; i < files.length; ++i) {
        const htmlDoc = new TILvertHTMLDocument();
        htmlDoc.setTitle(options.title);
        htmlDoc.setLanguage(options.lang);
        htmlDoc.addStylesheet(options.stylesheet);
        meta.forEach((tag) => {
          if (tag.value) {
            htmlDoc.appendMetaTag(tag.key, tag.value);
          }
        });

        processor.setHTMLDocument(htmlDoc);

        const parsedPath = FileIO.parsePath(files[i] as string);
        const data = await FileIO.readFile(files[i] as string);

        if (!data) {
          console.error("Error: Unable to read file.");
          if (!isDirectory) process.exit(1);
          else return;
        }

        processor.process(data);

        const outDir = isDirectory
          ? FileIO.join(
              options.output,
              parsedPath.dir,
              `${parsedPath.name}.html`
            )
          : FileIO.join(options.output, `${parsedPath.name}.html`);

        const written = await FileIO.writeFile(outDir, htmlDoc.renderHTML());
        if (!written) {
          console.error(`Error: Unable to write file. ${outDir}`);
        }
      }
    })
  );

  const index = new TILvertHTMLDocument();
  index.setTitle(options.title);
  index.setLanguage(options.language);
  index.addStylesheet(options.stylesheet);
  meta.forEach((tag) => {
    if (tag.value) {
      index.appendMetaTag(tag.key, tag.value);
    }
  });

  generateIndex(options.output, index);
  console.log(`Output directory: ${FileIO.resolve(options.output)}`);
}

main();
