"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const toml_1 = require("toml");
const arg_map_1 = require("./arg-map");
const utils_1 = require("../utils");
class CLICommand {
    static getInstance(commandList) {
        if (!CLICommand.instance) {
            CLICommand.instance = new CLICommand(commandList);
        }
        return CLICommand.instance;
    }
    constructor(commandList) {
        var _a, _b, _c;
        this.program = new commander_1.Command();
        this.program
            .name((_a = process.env.npm_package_name) !== null && _a !== void 0 ? _a : "tilvert")
            .version((_b = this.getVersion()) !== null && _b !== void 0 ? _b : "0.0.0", "-v, --version", "Output the version info")
            .description((_c = process.env.npm_package_description) !== null && _c !== void 0 ? _c : "Simple Text to HTML CLI converter and SSG utility")
            .argument("path", "Path to file or directory to convert");
        arg_map_1.CLIArgumentMap.forEach((arg) => {
            this.program.option((arg.short_form ? `-${arg.short_form}, ` : "") +
                `--${arg.long_form}` +
                (arg.value ? ` <${arg.value}>` : ""), arg.description, arg.default);
        });
        this.program.parse(commandList !== null && commandList !== void 0 ? commandList : process.argv);
        this.options = this.program.opts();
        this.arguments = this.program.args;
        if (this.options.config) {
            this.readConfigFile(this.options.config);
        }
    }
    getVersion() {
        var _a, _b, _c, _d;
        let tilVersion = `${(_a = process.env.npm_package_name) !== null && _a !== void 0 ? _a : "tilvert"} ${(_b = process.env.npm_package_version) !== null && _b !== void 0 ? _b : "0.0.0"}\n`;
        tilVersion += `${"License:".padEnd(18)}${(_c = process.env.npm_package_license) !== null && _c !== void 0 ? _c : "MIT"}\n`;
        tilVersion += `${"Written by:".padEnd(18)}${(_d = process.env.npm_package_author_name) !== null && _d !== void 0 ? _d : "Omar Hussein"}`;
        return tilVersion;
    }
    readConfigFile(path) {
        const configData = utils_1.FileIO.readFileSync(path);
        if (!configData) {
            console.error("Error: Unable to read configuration file.");
            process.exit(1);
        }
        // parse the configuration file
        const config = (0, toml_1.parse)(configData);
        // override the options with the configuration file
        Object.keys(config).forEach((key) => {
            if (!this.options[key])
                this.options[key] = config[key];
        });
    }
    getOptions() {
        return this.options;
    }
    setOption(key, value) {
        this.options[key] = value;
    }
    getArguments() {
        return this.arguments;
    }
    outputHelp() {
        this.program.outputHelp();
    }
}
exports.default = CLICommand;
//# sourceMappingURL=command.js.map