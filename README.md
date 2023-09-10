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

| Option                              | Description                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------ |
| -e, --extension &lt;extension&gt;   | Extension for the files in the input directory. (Ignored if input is file). Default (txt). |
| -o, --output &lt;output&gt;         | Path to the output directory. Default (./til).                                             |
| -s, --stylesheet &lt;stylesheet&gt; | Path to the stylesheet.                                                                    |
| --title &lt;title&gt;               | Title of the HTML page.                                                                    |
| --author &lt;author&gt;             | Author of the HTML page.                                                                   |
| --description &lt;description&gt;   | Description of the HTML page.                                                              |
| --keywords &lt;keywords&gt;         | Keywords of the HTML page.                                                                 |
| --robots &lt;robots&gt;             | Robots of the HTML page.                                                                   |
| --generator &lt;generator&gt;       | Generator of the HTML page.                                                                |
| --theme-color &lt;theme-color&gt;   | Theme color of the HTML page.                                                              |
