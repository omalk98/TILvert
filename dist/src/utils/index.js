"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TILvertHTMLDocument = exports.FileIO = exports.generateIndex = exports.processFile = exports.processArguments = void 0;
const arg_map_1 = __importDefault(require("./arg-map"));
exports.processArguments = arg_map_1.default;
const process_file_1 = require("./process-file");
Object.defineProperty(exports, "processFile", { enumerable: true, get: function () { return process_file_1.processFile; } });
Object.defineProperty(exports, "generateIndex", { enumerable: true, get: function () { return process_file_1.generateIndex; } });
const file_io_1 = __importDefault(require("./file-io"));
exports.FileIO = file_io_1.default;
const html_doc_1 = __importDefault(require("./html-doc"));
exports.TILvertHTMLDocument = html_doc_1.default;
