import { existsSync, mkdirSync, openSync , PathLike, closeSync, writeFile } from "fs";
import { LOGGER } from "./log/WinstonLogger";

export class FileUtils {

    public static createDirectory(path: string): void {
        if (!existsSync(path)) mkdirSync(path);
    }

    public static createFile(path: string): void {
        if (!existsSync(path)) closeSync(openSync(path, "w"));
    }

    public static writeToFile(path: string, content: string, successMessage: string, errorMessage: string): void {
        this.createFile(path);
        writeFile(path, content, (error: NodeJS.ErrnoException | null): void => {
            if (error) LOGGER.error(errorMessage);
            else LOGGER.info(successMessage);
        });
    }
}