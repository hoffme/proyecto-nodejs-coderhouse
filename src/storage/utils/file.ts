import fs from 'fs';

class FileStorage<T> {

    public readonly path: string

    constructor(path: string) { this.path = path }

    async get(): Promise<T> {
        const text = await fs.promises.readFile(this.path)
        return JSON.parse(text.toString());
    }

    async set(obj: T): Promise<void> {
        const text = JSON.stringify(obj);
        
        try {
            return await fs.promises.writeFile(this.path, text);
        } catch (e: any) {
            if (e.code !== 'ENOENT') throw e;

            const route = this.path.split('/');
            await fs.promises.mkdir(route.slice(0, route.length - 1).join('/'));
        }

        return await fs.promises.writeFile(this.path, text);        
    }
}

export default FileStorage;