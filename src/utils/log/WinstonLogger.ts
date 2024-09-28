import { createLogger, Logger, format, config, transports, Logform } from "winston";


const LOG_DIRECTORY_PATH: string = "./LOGS/";
const LOG_EXTENSION = ".log";

/**
 * @note transports.File creates the files for you if they don't exists
 */
const getTransportsFile = (level: string): transports.FileTransportInstance => {
    return new transports.File({
        filename: LOG_DIRECTORY_PATH + level + LOG_EXTENSION,
        level: level,
        format: format.combine(
            format((info: Logform.TransformableInfo, opts: any) => info.level === level ? info : false)(), //[ref] to be able to transport logs to specific files per levels 
            format.timestamp(), 
            format.json()
        )
    })
}

/**
 * @ref https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
 */
export const LOGGER: Logger = createLogger({
    levels: config.syslog.levels,
    level: "debug",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(),
        getTransportsFile("alert"),
        getTransportsFile("info"),
        getTransportsFile("error"),
        getTransportsFile("crit"),
        getTransportsFile("debug"),
        getTransportsFile("emerg"),
        getTransportsFile("notice"),
        getTransportsFile("warning"),
    ]
});

