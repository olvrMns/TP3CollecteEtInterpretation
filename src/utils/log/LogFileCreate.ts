import { existsSync, mkdirSync, openSync , PathLike, closeSync } from "fs";
import { config } from "winston";

export const LOG_DIRECTORY_PATH: PathLike = "./LOGS/";
export const LOG_EXTENSION = ".log";

export const createLoggingFileStructure: () => void = (): void => {
    if (!existsSync(LOG_DIRECTORY_PATH)) mkdirSync(LOG_DIRECTORY_PATH);
    for (const level in config.syslog.levels)
        if (!existsSync(LOG_DIRECTORY_PATH + level + LOG_EXTENSION)) closeSync(openSync(LOG_DIRECTORY_PATH + level + LOG_EXTENSION, "w"));
}