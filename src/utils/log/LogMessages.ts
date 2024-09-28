
/**
 * @ref 
 * - https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
 * - https://stackoverflow.com/questions/42884751/whats-the-meaning-of-static-get-in-javascript-es6
 * - https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
 */
export class LogMessages {

    public static get SERVER_START(): string { return "Server started successfully..." }
    public static get FAKE_STORE_DATA_FILE_ERROR(): string { return "Something went wrong while writing the fake data..." }
    public static get FAKE_STORE_DATA_FILE_SUCCESS(): string { return "Fake data writing operation was successfull..." }

}