import { Entity } from "../interfaces/entity.interface";
import { FileUtils } from "./fileUtils";
import { LogMessages } from "./log/logMessages";

/**
 * @ref 
 * - https://stackoverflow.com/questions/38688822/how-to-parse-json-string-in-typescript
 */
export class JsonUtils<T extends Entity> {

    public toArray(rawJsonData: any): T[] {
        return JSON.parse(JSON.stringify(rawJsonData)) as T[];
    }

    public toObject(rawJsonData: any): T {
        return JSON.parse(JSON.stringify(rawJsonData)) as T;
    } 

    public async addObject(object: T, path: string): Promise<boolean> {
        let objects: T[] = this.toArray(await FileUtils.readFile_(path));
        objects.push(object);
        return await FileUtils.writeFile_(path, JSON.stringify(objects));
    }
}