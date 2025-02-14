import { APIError } from "./api.error";

export class FormatError extends APIError {

    public static emailFormatError() {
        return new this("Wrong email format!");
    }

    public static usernameFormatError() {
        return new this("Wrong username format!");
    }

    public static firstLastNameFormatError() {
        return new this("Wrong First/Last name format!");
    }

    public static passwordFormatError() {
        return new this("Password must have atleast one number, one lower/upper case letter, one special character and must be made of atleast 8 charactes");
    }

    public static positiveNumberError(attributeName: string) {
        return new this("[" + attributeName +  "]" + " must be positive!");
    }

    public static strLimitError(attributeName: string, limit: number) {
        return new this(`[${attributeName}] must be less than ${limit + 1} characters!`);
    }

}