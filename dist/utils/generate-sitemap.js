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
Object.defineProperty(exports, "__esModule", { value: true });
const sitemap_1 = require("sitemap");
const stream_1 = require("stream");
const index_1 = require("./index");
// Create a stream to write to
const stream = new sitemap_1.SitemapStream({
    hostname: "https://omalk98.github.io/TILvert/",
});
// Return a promise that resolves with your XML string
function generateSitemap(outputDirectory, links) {
    return __awaiter(this, void 0, void 0, function* () {
        if (links !== undefined && links !== null) {
            links = (yield index_1.FileIO.getFiles(outputDirectory, "html")).map((file) => {
                const segments = index_1.FileIO.split(file);
                segments.shift();
                return { url: index_1.FileIO.join(...segments) };
            });
        }
        const sitemap = yield (0, sitemap_1.streamToPromise)(stream_1.Readable.from(links !== null && links !== void 0 ? links : [])
            .pipe(stream)
            .on("error", console.error)).then((data) => data.toString());
        outputDirectory = index_1.FileIO.join(outputDirectory, "sitemap.xml");
        const written = yield index_1.FileIO.writeFile(outputDirectory, sitemap);
        if (!written) {
            console.error(`Error: Unable to write sitemap. ${outputDirectory}`);
        }
    });
}
exports.default = generateSitemap;
//# sourceMappingURL=generate-sitemap.js.map