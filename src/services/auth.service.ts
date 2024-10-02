import { hash, compare, genSalt } from 'bcryptjs';

/**
 * @ref
 * - https://github.com/dcodeIO/bcrypt.js
 * - https://medium.com/@arunchaitanya/salting-and-hashing-passwords-with-bcrypt-js-a-comprehensive-guide-f5e31de3c40c
 * - https://security.stackexchange.com/questions/133304/what-is-the-cost-of-hashing
 * - https://www.youtube.com/watch?v=LZq0G8WUaII&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=10
 */
export class AuthService {

    public static async _hashPwd(rawPassword: string): Promise<string> {
        return await hash(rawPassword, await genSalt(parseInt(process.env._HASH_ROUNDS as string)));
    }

    public static async _comparePwd(rawPassword: string, hashedPassword: string): Promise<boolean> {
        return await compare(rawPassword, hashedPassword);
    }

    public static async _login() {
    
    }

    public static async _signup() {
        
    }

}