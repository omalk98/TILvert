import { readFileSync } from "fs";
import { stat, mkdir, writeFile, readFile, readdir, unlink } from "fs/promises";
import { join, resolve, parse, sep, type ParsedPath } from "path";
import { rimraf } from "rimraf";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class FileIO {
  public static readonly separator = sep;

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

  public static readFileSync(path: string): string | null {
    try {
      return readFileSync(path, "utf8");
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public static writeFile = async (
    path: string,
    data: string
  ): Promise<boolean> => {
    try {
      const tmp = this.split(path);
      tmp.pop();
      await this.mkdirIfNotExists(join(...tmp));

      await writeFile(path, data, "utf8");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  public static clearDirectory = async (path: string): Promise<boolean> => {
    try {
      const result = await rimraf(path);
      return result;
    } catch (e) {
      return false;
    }
  };

  public static deleteFile = async (path: string): Promise<boolean> => {
    try {
      await unlink(path);
      return true;
    } catch (e) {
      return false;
    }
  };

  public static getFiles = async (
    path: string,
    extension?: string
  ): Promise<string[]> => {
    try {
      const entries = await readdir(path, { withFileTypes: true });
      const files = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        entries.map((file) => {
          const res = join(path, file.name);
          if (file.isDirectory()) return this.getFiles(res, extension);

          return res.endsWith(`.${extension}`) ? res : [];
        })
      );
      return Array.prototype.concat(...files);
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  public static join(...paths: string[]): string {
    return join(...paths);
  }

  public static resolve(...paths: string[]): string {
    return resolve(...paths);
  }

  public static parsePath(path: string): ParsedPath {
    return parse(path);
  }

  public static split(path: string): string[] {
    return path.split(this.separator);
  }
}
