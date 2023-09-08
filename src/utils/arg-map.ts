export interface CLIArgument {
  name: string;
  key: string;
  long_form: string;
  short_form?: string;
  description: string;
  is_flag?: boolean;
  default: boolean | string | null;
}

export const CLIArgumentMap: Array<CLIArgument> = [
  {
    name: "Help",
    key: "isHelp",
    long_form: "help",
    short_form: "h",
    description: "Displays help information.",
    is_flag: true,
    default: false,
  },
  {
    name: "Version",
    key: "isVersion",
    long_form: "version",
    short_form: "v",
    description: "Displays version information.",
    is_flag: true,
    default: false,
  },
  {
    name: "Output",
    key: "outputDirectory",
    long_form: "output",
    short_form: "o",
    description: "Path to the output directory.",
    default: "./til",
  },
  {
    name: "Stylesheet",
    key: "stylesheet",
    long_form: "stylesheet",
    short_form: "s",
    description: "Path to the stylesheet.",
    default: null,
  },
  {
    name: "Extension",
    key: "extension",
    long_form: "extension",
    short_form: "e",
    description:
      "Extension for the files in the input directory. (Ignored if input is file)",
    default: "txt",
  },
];

export default function processArguments(): [
  Map<string, boolean | string | null>,
  string
] {
  const arg_map = new Map<string, boolean | string | null>();
  let input = "";
  CLIArgumentMap.forEach((arg: CLIArgument) => {
    const longArgIndex = process.argv.indexOf(`--${arg.long_form}`);
    const shortArgIndex = process.argv.indexOf(`-${arg.short_form}`);

    if (longArgIndex !== -1 || shortArgIndex !== -1) {
      // Argument found in command line, update argMap with the provided value
      if (
        longArgIndex !== -1 &&
        longArgIndex + 1 < process.argv.length &&
        !arg.is_flag &&
        process.argv[longArgIndex + 1][0] !== "-"
      ) {
        arg_map.set(arg.key, process.argv[longArgIndex + 1]);
      } else if (
        shortArgIndex !== -1 &&
        shortArgIndex + 1 < process.argv.length &&
        !arg.is_flag &&
        process.argv[shortArgIndex + 1][0] !== "-"
      ) {
        arg_map.set(arg.key, process.argv[shortArgIndex + 1]);
      } else {
        // Argument provided without a value, set it to true
        arg_map.set(arg.key, true);
      }
      // Argument not found in command line, set it to the default value
    } else arg_map.set(arg.key, arg.default);
  });

  return [arg_map, input];
}
