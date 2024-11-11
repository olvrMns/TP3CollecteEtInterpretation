export class APIError extends Error {
    constructor(message: string) {
        super(message);
    }

    public static otherError() {
        return new this("Something unexptected happened during the authentication process!");
    }

    public static entityNotFound() {
        return new this("Could not retrieve entity!");
    }
}