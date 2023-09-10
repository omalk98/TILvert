# TILvert

A simple tool to convert TILs from markdown files to HTML

## Installation

```bash
$ cd TILvert
$ npm install -g
```

## Usage

```bash
$ tilvert [flags/options] <path>
```

If no path is specified, TILvert will read the current directory recursively to find all files with the matching extension (default "txt").

### Flags

| Flag          | Description                   |
| ------------- | ----------------------------- |
| -h, --help    | Displays help information.    |
| -v, --version | Displays version information. |

### Options

| Option                        | Description                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| -e, --extension <extension>   | Extension for the files in the input directory. (Ignored if input is file). Default (txt). |
| -o, --output <output>         | Path to the output directory. Default (./til).                                             |
| -s, --stylesheet <stylesheet> | Path to the stylesheet.                                                                    |
| --title <title>               | Title of the HTML page.                                                                    |
| --author <author>             | Author of the HTML page.                                                                   |
| --description <description>   | Description of the HTML page.                                                              |
| --keywords <keywords>         | Keywords of the HTML page.                                                                 |
| --robots <robots>             | Robots of the HTML page.                                                                   |
| --generator <generator>       | Generator of the HTML page.                                                                |
| --theme-color <theme-color>   | Theme color of the HTML page.                                                              |
