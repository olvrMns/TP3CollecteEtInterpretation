import { mkdir, readFile, rm, writeFile, access, constants } from "fs/promises";
import { LOGGER } from "./log/winstonLogger";
import { LogMessages } from "./log/logMessages";

/**
 * @ref
 * - https://stackoverflow.com/questions/17699599/node-js-check-if-file-exists
 * - https://nodejs.org/dist/latest-v10.x/docs/api/fs.html
 */
export class FileUtils {

    private static async execute(ioOperation: () => Promise<void>): Promise<boolean> {
        try {
            await ioOperation();
            LOGGER.info(LogMessages.IO_OPERATION_SUCCESSFULL);
            return true;
        } catch (error) { 
            LOGGER.error(error);
            return false 
        }
    }

    /**
     * @ref
     * - https://barker.codes/blog/asynchronously-check-if-a-file-exists-in-node-js/
     */
    public static async exists(filePath: string): Promise<boolean> {
        let res: boolean = true;
        await access(filePath, constants.F_OK)
        .then(() => { res = true; })
        .catch((error) => {res = false});
        return res;
    }

    public static async createDirectory_(path: string): Promise<boolean> {
        return this.execute(async () => await mkdir(path));
    }

    public static async removeFile_(path: string): Promise<boolean> {
        return this.execute(async () => await rm(path));
    }

    public static async writeFile_(path: string, content: string): Promise<boolean> {
        return this.execute(async () => await writeFile(path, content));
    }

    public static async readFile_(path: string): Promise<string | null> {
        try {
            let buffer: Buffer = await readFile(path);
            LOGGER.info(LogMessages.IO_OPERATION_SUCCESSFULL);
            return buffer.toString();
        } catch (error) {
            LOGGER.error(error);
            return null;
        }
    }
}