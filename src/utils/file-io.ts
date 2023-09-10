import { readdirSync } from "fs";
import {
  stat,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rmdir,
  unlink,
} from "fs/promises";
import { join, resolve } from "path";

export default class FileIO {
  public static isFile = async (path: string): Promise<boolean> => {
    try {
      const stats = await stat(path);
      return stats.isFile();
    } catch {
      return false;
    }
  };

  public static isDirectory = async (path: string): Promise<boolean> => {
    try {
      const stats = await stat(path);
      return stats.isDirectory();
    } catch {
      return false;
    }
  };

  public static mkdirIfNotExists = async (path: string): Promise<void> => {
    try {
      await stat(path);
    } catch {
      await mkdir(path, { recursive: true });
    }
  };

  public static readFile = async (path: string): Promise<string | null> => {
    try {
      const data = await readFile(path, "utf8");
      return data;
    } catch (e) {
      console.error(e);
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
      await this.mkdirIfNotExists(join(...tmp));

      await writeFile(path, data, "utf8");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  public static replicateDirectoryStructure = async (
    source: string,
    destination: string
  ): Promise<boolean> => {
    try {
      await this.clearDirectory(join(destination, source));
      const files = await readdir(source);

      await Promise.all(
        files.map(async (file) => {
          const dirPath = join(source, file);
          const stats = await stat(dirPath);

          if (stats.isDirectory()) {
            await this.mkdirIfNotExists(join(destination, dirPath));
            await this.replicateDirectoryStructure(
              dirPath,
              join(destination, dirPath)
            );
          }
        })
      );

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  public static clearDirectory = async (path: string): Promise<boolean> => {
    try {
      const files = await readdir(path, { withFileTypes: true });

      await Promise.all(
        files.map(async (file) => {
          const dirPath = join(path, file.name);

          if (file.isDirectory()) {
            await this.clearDirectory(dirPath);
          } else {
            await unlink(dirPath);
          }
        })
      );

      await rmdir(path);

      return true;
    } catch (e) {
      return false;
    }
  };

  public static readDirectoryRecursiveSync(
    path: string,
    extension?: string
  ): Array<string> {
    const filenames: Array<string> = [];
    const files = readdirSync(path, { withFileTypes: true });

    files.forEach((file) => {
      const filePath = join(path, file.name);

      if (file.isDirectory()) {
        const subFiles = this.readDirectoryRecursiveSync(filePath, extension);

        subFiles.forEach((filename) => {
          filenames.push(filename);
        });
      } else {
        if (extension) {
          if (filePath.toLocaleLowerCase().endsWith(`.${extension}`)) {
            filenames.push(filePath);
          }
        } else filenames.push(filePath);
      }
    });

    return filenames;
  }

  public static deleteFile = async (path: string): Promise<boolean> => {
    try {
      await unlink(path);
      return true;
    } catch (e) {
      return false;
    }
  };

  public static readDirectoryRecursive = async (
    path: string,
    extension?: string
  ): Promise<Array<string>> => {
    try {
      const filenames: Array<string> = [];
      const files = await readdir(path, { withFileTypes: true });

      files.forEach((file) => {
        const filePath = join(path, file.name);

        if (file.isDirectory()) {
          const subFiles = this.readDirectoryRecursiveSync(filePath, extension);

          subFiles.forEach((filename) => {
            filenames.push(filename);
          });
        } else {
          if (extension) {
            if (filePath.toLocaleLowerCase().endsWith(`.${extension}`)) {
              filenames.push(filePath);
            }
          } else filenames.push(filePath);
        }
      });

      return filenames;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  public static join = (...paths: Array<string>): string => {
    return join(...paths);
  };

  public static resolve = (...paths: Array<string>): string => {
    return resolve(...paths);
  };
}
