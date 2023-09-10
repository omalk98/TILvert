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
class FileIO {
    static readDirectoryRecursiveSync(path, extension) {
        const filenames = [];
        const files = (0, fs_1.readdirSync)(path, { withFileTypes: true });
        files.forEach((file) => {
            const filePath = (0, path_1.join)(path, file.name);
            if (file.isDirectory()) {
                const subFiles = this.readDirectoryRecursiveSync(filePath, extension);
                subFiles.forEach((filename) => {
                    filenames.push(filename);
                });
            }
            else {
                if (extension) {
                    if (filePath.toLocaleLowerCase().endsWith(`.${extension}`)) {
                        filenames.push(filePath);
                    }
                }
                else
                    filenames.push(filePath);
            }
        });
        return filenames;
    }
}
_a = FileIO;
FileIO.isFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, promises_1.stat)(path);
        return stats.isFile();
    }
    catch (e) {
        console.error(e);
        return false;
    }
});
FileIO.isDirectory = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, promises_1.stat)(path);
        return stats.isDirectory();
    }
    catch (e) {
        console.error(e);
        return false;
    }
});
FileIO.mkdirIfNotExists = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.stat)(path);
    }
    catch (e) {
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
        let tmp = path.split("/");
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
FileIO.replicateDirectoryStructure = (source, destination) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield _a.clearDirectory((0, path_1.join)(destination, source));
        const files = yield (0, promises_1.readdir)(source);
        yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const dirPath = (0, path_1.join)(source, file);
            const stats = yield (0, promises_1.stat)(dirPath);
            if (stats.isDirectory()) {
                yield _a.mkdirIfNotExists((0, path_1.join)(destination, dirPath));
                yield _a.replicateDirectoryStructure(dirPath, (0, path_1.join)(destination, dirPath));
            }
        })));
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
});
FileIO.clearDirectory = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield (0, promises_1.readdir)(path, { withFileTypes: true });
        yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const dirPath = (0, path_1.join)(path, file.name);
            if (file.isDirectory()) {
                yield _a.clearDirectory(dirPath);
            }
            else {
                yield (0, promises_1.unlink)(dirPath);
            }
        })));
        yield (0, promises_1.rmdir)(path);
        return true;
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
FileIO.readDirectoryRecursive = (path, extension) => __awaiter(void 0, void 0, void 0, function* () {
    const filenames = [];
    const files = yield (0, promises_1.readdir)(path, { withFileTypes: true });
    files.forEach((file) => {
        const filePath = (0, path_1.join)(path, file.name);
        if (file.isDirectory()) {
            const subFiles = _a.readDirectoryRecursiveSync(filePath, extension);
            subFiles.forEach((filename) => {
                filenames.push(filename);
            });
        }
        else {
            if (extension) {
                if (filePath.toLocaleLowerCase().endsWith(`.${extension}`)) {
                    filenames.push(filePath);
                }
            }
            else
                filenames.push(filePath);
        }
    });
    return filenames;
});
FileIO.join = (...paths) => {
    return (0, path_1.join)(...paths);
};
FileIO.resolve = (...paths) => {
    return (0, path_1.resolve)(...paths);
};
exports.default = FileIO;
