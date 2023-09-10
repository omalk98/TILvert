import { CLIArgumentMap } from "../utils/arg-map";
import { name, author, version, license } from "../../package.json";

export default class Info {
  public static getHelp(): void {
    let help = `Usage: ${
      process.env.npm_package_name ?? name
    } [flags/options]... [file/folder]...\n`;

    help += "Flags:\n";
    CLIArgumentMap.filter((arg) => arg.is_flag).forEach((arg) => {
      help += `  ${
        arg.short_form ? `-${arg.short_form}, ` : ""
      }--${arg.long_form.padEnd(arg.short_form ? 18 : 22)} ${
        arg.description
      }\n`;
    });

    help += "Options:\n";
    CLIArgumentMap.filter((arg) => !arg.is_flag).forEach((arg) => {
      help += `  ${
        arg.short_form ? `-${arg.short_form}, ` : ""
      }--${arg.long_form.padEnd(arg.short_form ? 18 : 22)} ${
        arg.description
      }\n`;
    });

    console.log(help);
  }

  public static getVersion(): void {
    let tilVersion = `${process.env.npm_package_name ?? name} ${
      process.env.npm_package_version ?? version
    }\n`;

    tilVersion += `${"License:".padEnd(18)}${
      process.env.npm_package_license ?? license
    }\n`;
    tilVersion += `${"Written by:".padEnd(18)}${
      process.env.npm_package_author_name ?? author.name
    }\n`;

    console.log(tilVersion);
  }
}
