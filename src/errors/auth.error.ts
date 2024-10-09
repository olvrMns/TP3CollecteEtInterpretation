import { APIError } from "./abs.error";

export class AuthError extends APIError {

    public static notAuthorizedError(): AuthError {
        return new this("Not authorized!");
    }

    public static notAuthenticatedError(): AuthError {
        return new this("Not authenticated!");
    }

    public static credentialsError(): AuthError {
        return new this("Login error!");
    }

}