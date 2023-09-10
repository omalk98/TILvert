import {
  stat,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rmdir,
  unlink,
} from "fs/promises";

export default class FileIO {
  public static isFile = async (path: string): Promise<boolean> => {
    try {
      const stats = await stat(path);
      return stats.isFile();
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  public static isDirectory = async (path: string): Promise<boolean> => {
    try {
      const stats = await stat(path);
      return stats.isDirectory();
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  public static mkdirIfNotExists = async (path: string): Promise<void> => {
    try {
      await stat(path);
    } catch (e) {
      await mkdir(path, { recursive: true });
    }
  };

  public static readFile = async (path: string): Promise<string | null> => {
    try {
      const data = await readFile(path, "utf8");
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  public static writeFile = async (
    path: string,
    data: string
  ): Promise<boolean> => {
    try {
      let tmp = path.split("/");
      tmp.pop();
      this.mkdirIfNotExists(tmp.join("/"));

      await writeFile(path, data, "utf8");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  public static replicateDirectoryStructure = async (
    source: string,
    destination: string
  ): Promise<boolean> => {
    try {
      const files = await readdir(source);

      await Promise.all(
        files.map(async (file) => {
          const dirPath = `${source}/${file}`;
          const stats = await stat(dirPath);

          if (stats.isDirectory()) {
            await this.mkdirIfNotExists(`${destination}/${file}`);
            await this.replicateDirectoryStructure(
              dirPath,
              `${destination}/${file}`
            );
          }
        })
      );

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  public static clearDirectory = async (path: string): Promise<boolean> => {
    try {
      const files = await readdir(path);

      await Promise.all(
        files.map(async (file) => {
          const dirPath = `${path}/${file}`;
          const stats = await stat(dirPath);

          if (stats.isDirectory()) {
            await this.clearDirectory(dirPath);
          } else {
            await unlink(dirPath);
          }
        })
      );

      await rmdir(path);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
}
