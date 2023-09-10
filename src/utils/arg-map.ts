export interface CLIArgument {
  name: string;
  key: string;
  long_form: string;
  short_form?: string;
  description: string;
  is_flag?: boolean;
  default: boolean | string | null;
}

export default function processArguments(
  argv: Array<string>
): [Map<string, boolean | string | null>, string] {
  const arg_map = new Map<string, boolean | string | null>();
  let input = ".";
  let lastIndex = 0;
  CLIArgumentMap.forEach((arg: CLIArgument) => {
    const longArgIndex = argv.indexOf(`--${arg.long_form}`);
    const shortArgIndex = argv.indexOf(`-${arg.short_form}`);

    if (longArgIndex !== -1 || shortArgIndex !== -1) {
      // Argument found in command line, update argMap with the provided value
      if (
        longArgIndex !== -1 &&
        longArgIndex + 1 < argv.length &&
        !arg.is_flag &&
        argv[longArgIndex + 1][0] !== "-"
      ) {
        arg_map.set(arg.key, argv[longArgIndex + 1]);

        if (longArgIndex >= lastIndex) lastIndex = longArgIndex + 1;
      } else if (
        shortArgIndex !== -1 &&
        shortArgIndex + 1 < argv.length &&
        !arg.is_flag &&
        argv[shortArgIndex + 1][0] !== "-"
      ) {
        arg_map.set(arg.key, argv[shortArgIndex + 1]);

        if (shortArgIndex >= lastIndex) lastIndex = shortArgIndex + 1;
      } else {
        // Argument provided without a value, set it to true
        arg_map.set(arg.key, true);

        if (longArgIndex >= lastIndex || shortArgIndex >= lastIndex)
          lastIndex = longArgIndex !== -1 ? longArgIndex : shortArgIndex;
      }
      // Argument not found in command line, set it to the default value
    } else arg_map.set(arg.key, arg.default);
  });

  if (lastIndex + 1 <= argv.length) input = argv[argv.length - 1];

  return [arg_map, input];
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
  {
    name: "Title",
    key: "title",
    long_form: "title",
    description: "Title for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Author",
    key: "author",
    long_form: "author",
    description: "Author meta tag for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Description",
    key: "description",
    long_form: "description",
    description: "Description meta tag for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Keywords",
    key: "keywords",
    long_form: "keywords",
    description: "Keywords meta tag for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Rating",
    key: "rating",
    long_form: "rating",
    description: "Rating meta tag for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Robots",
    key: "robots",
    long_form: "robots",
    description: "Robots meta tag for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Generator",
    key: "generator",
    long_form: "generator",
    description: "Generator meta tag for the generated HTML file.",
    default: null,
  },
  {
    name: "Meta Theme Color",
    key: "themeColor",
    long_form: "theme-color",
    description: "Theme color meta tag for the generated HTML file.",
    default: null,
  },
];
