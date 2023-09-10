"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arg_map_1 = require("../utils/arg-map");
const package_json_1 = require("../../package.json");
class Info {
    static getHelp() {
        var _a;
        let help = `Usage: ${(_a = process.env.npm_package_name) !== null && _a !== void 0 ? _a : package_json_1.name} [flags/options]... [file/folder]...\n`;
        help += "Flags:\n";
        arg_map_1.CLIArgumentMap.filter((arg) => arg.is_flag).forEach((arg) => {
            help += `  ${arg.short_form ? `-${arg.short_form}, ` : ""}--${arg.long_form.padEnd(arg.short_form ? 18 : 22)} ${arg.description}${arg.default ? ` Default: <${arg.default}>` : ""}\n`;
        });
        help += "Options:\n";
        arg_map_1.CLIArgumentMap.filter((arg) => !arg.is_flag).forEach((arg) => {
            help += `  ${arg.short_form ? `-${arg.short_form}, ` : ""}--${arg.long_form.padEnd(arg.short_form ? 18 : 22)} ${arg.description}${arg.default ? ` Default: <${arg.default}>` : ""}\n`;
        });
        console.log(help);
    }
    static getVersion() {
        var _a, _b, _c, _d;
        let tilVersion = `${(_a = process.env.npm_package_name) !== null && _a !== void 0 ? _a : package_json_1.name} ${(_b = process.env.npm_package_version) !== null && _b !== void 0 ? _b : package_json_1.version}\n`;
        tilVersion += `${"License:".padEnd(18)}${(_c = process.env.npm_package_license) !== null && _c !== void 0 ? _c : package_json_1.license}\n`;
        tilVersion += `${"Written by:".padEnd(18)}${(_d = process.env.npm_package_author_name) !== null && _d !== void 0 ? _d : package_json_1.author.name}\n`;
        console.log(tilVersion);
    }
}
exports.default = Info;
