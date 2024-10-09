import { APIError } from "./abs.error";

export class CrudError extends APIError {

    public static unexpectedSaveError(): CrudError {
        return new this("Something unexpected happened in the saving process...");
    }

    public static notUniqueError(attributeName: string): CrudError {
    return new this("[" + attributeName + "]" + " is not unique!");
    }
}