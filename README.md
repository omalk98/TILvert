# TILvert

A simple tool to convert TILs from markdown files to HTML

## Installation

```bash
$ npm install -g https://github.com/omalk98/TILvert.git
```

## Uninstall

```bash
$ npm uninstall -g tilvert
```

## Build From Source

```bash
$ git clone https://github.com/omalk98/TILvert.git
$ cd TILvert
$ npm install
$ npm run build
```

## Usage

### Installed

```bash
$ tilvert [flags/options] <path>
```

### From Source

```bash
$ node dist/src/main.js [flags/options] <path>
```

OR

```bash
$ npm run start [flags/options] <path>
```

If no path is specified, TILvert will read the current directory recursively to find all files with the matching extension (default "txt").

### Flags

| Flag          | Description                   |
| ------------- | ----------------------------- |
| -h, --help    | Displays help information.    |
| -v, --version | Displays version information. |

### Options

| Option           | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| -e, --extension  | Extension for the files in the input directory. (Ignored if input is file). Default (txt). |
| -o, --output     | Path to the output directory. Default (./til).                                             |
| -s, --stylesheet | Path to the stylesheet.                                                                    |
| --title          | Title of the HTML page.                                                                    |
| --author         | Author of the HTML page.                                                                   |
| --description    | Description of the HTML page.                                                              |
| --keywords       | Keywords of the HTML page.                                                                 |
| --robots         | Robots of the HTML page.                                                                   |
| --generator      | Generator of the HTML page.                                                                |
| --theme-color    | Theme color of the HTML page.                                                              |

## License

TILvert is licensed under the [MIT License](https://mit-license.org/)

## Features

- [x] Convert markdown files to HTML
- [x] Replicate directory structure in output directory
- [x] Customizable HTML page with meta tags
- [x] Customizable stylesheet
- [x] Customizable extension for input files
- [x] Customizable output directory
