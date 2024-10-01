
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

    public static get DATA_ADDED_SUCCESSFULLY(): string { return "Object was successfully added to the file..." }
    public static get DATA_ADDED_ERROR(): string { return "Something went wrong while trying to add the object..." }

    public static get IO_OPERATION_SUCCESSFULL(): string { return "I/O operation was successfull..." }

    public static get GET_ONE_PRODUCT_REQUEST_RECEIVED(): string { return "Get one product request received..." }
    public static get REMOVE_ONE_PRODUCT_REQUEST_RECEIVED(): string { return "Delete one product request received..." }
    public static get ADD_ONE_PRODUCT_REQUEST_RECEIVED(): string { return "Add one product request received..." }
    public static get GET_ALL_PRODUCT_REQUEST_RECEIVED(): string { return "Get all product request received..." }

    
}