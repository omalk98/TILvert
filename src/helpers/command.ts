import { Command, type OptionValues } from "commander";
import { parse as tomlParse } from "toml";
import { CLIArgumentMap } from "./arg-map";
import { FileIO } from "../utils";

export default class CLICommand {
  private static instance: CLICommand;
  private readonly program: Command;
  private options: OptionValues;
  private readonly arguments: string[];

  public static getInstance(commandList?: string[]): CLICommand {
    if (!CLICommand.instance) {
      CLICommand.instance = new CLICommand(commandList);
    }
    return CLICommand.instance;
  }

  private constructor(commandList?: string[]) {
    this.program = new Command();
    this.program
      .name(process.env.npm_package_name ?? "tilvert")
      .version(
        this.getVersion() ?? "0.0.0",
        "-v, --version",
        "Output the version info"
      )
      .description(
        process.env.npm_package_description ??
          "Simple Text to HTML CLI converter and SSG utility"
      )
      .argument("path", "Path to file or directory to convert");

    CLIArgumentMap.forEach((arg) => {
      this.program.option(
        (arg.short_form ? `-${arg.short_form}, ` : "") +
          `--${arg.long_form}` +
          (arg.value ? ` <${arg.value}>` : ""),
        arg.description,
        arg.default
      );
    });

    this.options = this.program.opts();
    this.arguments = this.program.args;

    this.program.parse(process.argv);

    if (this.options.config) {
      this.readConfigFile(this.options.config);
    }
  }

  private getVersion(): string {
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

  public readConfigFile(path: string): void {
    const configData = FileIO.readFileSync(path);
    if (!configData) {
      console.error("Error: Unable to read configuration file.");
      process.exit(1);
    }

    // parse the configuration file
    const config = tomlParse(configData);

    // override the options with the configuration file
    Object.keys(config).forEach((key) => {
      if (!this.options[key]) this.options[key] = config[key];
    });
  }

  public getOptions(): OptionValues {
    return this.options;
  }

  public setOption(key: string, value: any): void {
    this.options[key] = value;
  }

  public getArguments(): string[] {
    return this.arguments;
  }

  public outputHelp(): void {
    this.program.outputHelp();
  }
}
