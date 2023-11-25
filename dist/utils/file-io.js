"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const rimraf_1 = require("rimraf");
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class FileIO {
    static readFileSync(path) {
        try {
            return (0, fs_1.readFileSync)(path, "utf8");
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    static join(...paths) {
        return (0, path_1.join)(...paths);
    }
    static resolve(...paths) {
        return (0, path_1.resolve)(...paths);
    }
    static parsePath(path) {
        return (0, path_1.parse)(path);
    }
    static split(path) {
        return path.split(this.separator);
    }
}
_a = FileIO;
FileIO.separator = path_1.sep;
FileIO.isFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, promises_1.stat)(path);
        return stats.isFile();
    }
    catch (_b) {
        return false;
    }
});
FileIO.isDirectory = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, promises_1.stat)(path);
        return stats.isDirectory();
    }
    catch (_c) {
        return false;
    }
});
FileIO.mkdirIfNotExists = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.stat)(path);
    }
    catch (_d) {
        yield (0, promises_1.mkdir)(path, { recursive: true });
    }
});
FileIO.readFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, promises_1.readFile)(path, "utf8");
        return data;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
FileIO.writeFile = (path, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tmp = _a.split(path);
        tmp.pop();
        yield _a.mkdirIfNotExists((0, path_1.join)(...tmp));
        yield (0, promises_1.writeFile)(path, data, "utf8");
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
});
FileIO.clearDirectory = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, rimraf_1.rimraf)(path);
        return result;
    }
    catch (e) {
        return false;
    }
});
FileIO.deleteFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.unlink)(path);
        return true;
    }
    catch (e) {
        return false;
    }
});
FileIO.getFiles = (path, extension) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield (0, promises_1.readdir)(path, { withFileTypes: true });
        const files = yield Promise.all(
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        entries.map((file) => {
            const res = (0, path_1.join)(path, file.name);
            if (file.isDirectory())
                return _a.getFiles(res, extension);
            return res.endsWith(`.${extension}`) ? res : [];
        }));
        return Array.prototype.concat(...files);
    }
    catch (e) {
        console.error(e);
        return [];
    }
});
exports.default = FileIO;
//# sourceMappingURL=file-io.js.map