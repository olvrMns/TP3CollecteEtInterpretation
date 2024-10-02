import { Entity } from "../interfaces/entity.interface";
import { FileUtils } from "./fileUtils";

/**
 * @ref 
 * - https://stackoverflow.com/questions/38688822/how-to-parse-json-string-in-typescript
 * - https://stackoverflow.com/questions/42494823/json-parse-returns-string-instead-of-object (????)
 */
export class JsonUtils<T extends Entity> {

    public toArray(rawJsonData: any): T[] {
        return JSON.parse(JSON.stringify(rawJsonData));
    }

    public toObject(rawJsonData: any): T {
        return JSON.parse(JSON.stringify(rawJsonData));
    } 

    public async addObject(object: T, path: string): Promise<boolean> {
        let objects: T[] = [];
        await FileUtils.readFile_(path).then(res => {
            objects = this.toArray(res);
            objects.push(object);
        });
        return await FileUtils.writeFile_(path, JSON.stringify(objects));
    }

    public async removeObject(object: T, path: string): Promise<boolean> {
        let objects: T[] = this.toArray(await FileUtils.readFile_(path));
        return await FileUtils.writeFile_(path, JSON.stringify(objects.filter(object_ => object_ != object)));
    }
}