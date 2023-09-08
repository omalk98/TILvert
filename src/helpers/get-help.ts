import { CLIArgumentMap } from "../utils/arg-map";

export default function getHelp(): void {
  let help = `Usage: ${process.env.npm_package_name} [flags/arguments]... [file/folder]...\n`;

  help += "Flags:\n";
  CLIArgumentMap.filter((arg) => arg.is_flag).forEach((arg) => {
    help += `  ${
      arg.short_form ? `-${arg.short_form}, ` : ""
    }--${arg.long_form.padEnd(arg.short_form ? 18 : 22)} ${arg.description}\n`;
  });

  help += "Arguments:\n";
  CLIArgumentMap.filter((arg) => !arg.is_flag).forEach((arg) => {
    help += `  ${
      arg.short_form ? `-${arg.short_form}, ` : ""
    }--${arg.long_form.padEnd(arg.short_form ? 18 : 22)} ${arg.description}\n`;
  });

  console.log(help);
}
