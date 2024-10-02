import { hash, compare, genSalt } from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

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

    /**
     * email: 'morrison@gmail.com', username: 'mor_2314', password: '83r5^_',
     * REGUALR EXPRESSION IMP TO DIFFERENTIATE EMAIL/USERNAME
     */
    public static async authenticate(usernameOrEmail: string, rawPassword: string): Promise<boolean> {
        let user: User | null= await UserService.getUser("username", usernameOrEmail);
        if (!user) user = await UserService.getUser("email", usernameOrEmail);
        return user ? this._comparePwd(rawPassword, user.password) : false;
    }     


}