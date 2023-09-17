import { Command } from "commander";
import { CLIArgumentMap } from "./arg-map";

const program = new Command();

program
  .name(process.env.npm_package_name ?? "tilvert")
  .version(getVersion() ?? "0.0.0", "-v, --version", "Output the version info")
  .description(
    process.env.npm_package_description ??
      "Simple Text to HTML CLI converter and SSG utility"
  )
  .argument("path", "Path to file or directory to convert");

CLIArgumentMap.forEach((arg) => {
  program.option(
    (arg.short_form ? `-${arg.short_form}, ` : "") +
      `--${arg.long_form}` +
      (arg.value ? ` <${arg.value}>` : ""),
    arg.description,
    arg.default
  );
});

function getVersion(): string {
  let tilVersion = `${process.env.npm_package_name ?? "tilvert"} ${
    process.env.npm_package_version ?? "0.0.0"
  }\n`;

  tilVersion += `${"License:".padEnd(18)}${
    process.env.npm_package_license ?? "MIT"
  }\n`;
  tilVersion += `${"Written by:".padEnd(18)}${
    process.env.npm_package_author_name ?? "Omar Hussein"
  }`;

  return tilVersion;
}

export default program as Command;
