import { SitemapStream, streamToPromise, type SitemapItemLoose } from "sitemap";
import { Readable } from "stream";
import { FileIO } from "./index";

// Create a stream to write to
const stream = new SitemapStream({
  hostname: "https://omalk98.github.io/TILvert/",
});

// Return a promise that resolves with your XML string
export default async function generateSitemap(
  outputDirectory: string,
  links?: SitemapItemLoose[]
): Promise<void> {
  if (links !== undefined && links !== null) {
    links = (await FileIO.getFiles(outputDirectory, "html")).map((file) => {
      const segments = FileIO.split(file);
      segments.shift();
      return { url: FileIO.join(...segments) };
    });
  }
  const sitemap = await streamToPromise(
    Readable.from(links ?? [])
      .pipe(stream)
      .on("error", console.error)
  ).then((data) => data.toString());

  outputDirectory = FileIO.join(outputDirectory, "sitemap.xml");
  const written = await FileIO.writeFile(outputDirectory, sitemap);

  if (!written) {
    console.error(`Error: Unable to write sitemap. ${outputDirectory}`);
  }
}
