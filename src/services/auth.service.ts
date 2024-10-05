import { hash, compare, genSalt } from 'bcryptjs';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { RegexUtils } from '../utils/regexUtils';
import { JwtPayload, Secret, sign, verify, VerifyErrors } from 'jsonwebtoken';
import { UserInfo } from '../models/user.model';

/**
 * @ref
 * - https://github.com/dcodeIO/bcrypt.js
 * - https://medium.com/@arunchaitanya/salting-and-hashing-passwords-with-bcrypt-js-a-comprehensive-guide-f5e31de3c40c
 * - https://security.stackexchange.com/questions/133304/what-is-the-cost-of-hashing
 * - https://www.youtube.com/watch?v=LZq0G8WUaII&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=10
 * - https://dev.to/juliecherner/authentication-with-jwt-tokens-in-typescript-with-express-3gb1
 * - https://gist.github.com/harveyconnor/eaadcb5e465a96e4211aa562541231a8
 * - https://stackoverflow.com/questions/35131333/jsonwebtoken-sign-fails-with-expiresin-option-set
 * - https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
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
     */
    public static async authenticateUser(usernameOrEmail: string, rawPassword: string): Promise<User | null> {
        let user: User | null = null;
        if (RegexUtils.testEmail(usernameOrEmail)) user = await UserService.getUser("email", usernameOrEmail);
        else user = await UserService.getUser("username", usernameOrEmail);
        if (user)  user = await this._comparePwd(rawPassword, user.password) ? user : null;      
        return user; 
    }     

    public static createToken(user: User): Promise<string | null> {
        return new Promise((resolve, reject) => {
            sign(
                {userInfo: UserInfo.getInstance(user.email, user.name, user.username)}, 
                process.env.PK as Secret, 
                {expiresIn: parseInt(process.env.EXPIRES_IN as string)}, 
                (error: Error | null, token: string | undefined) => {
                    if (!error && token) resolve(token as string);
                    reject(null);
                }
            );
        });
    }

    public static verifyToken(token: string): Promise<string | JwtPayload | undefined> {
        return new Promise((resolve, reject) => {
            verify(token, process.env.PK as Secret, (error: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
                if (error) reject(error);
                resolve(decoded);
            })
        });
    }

}