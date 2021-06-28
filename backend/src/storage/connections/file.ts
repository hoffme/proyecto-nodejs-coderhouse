import fs from 'fs';

class FileStorage {

    public readonly path: string

    constructor(path: string) { this.path = path }

    async get() {
        const text = await fs.promises.readFile(this.path)
        return JSON.parse(text.toString());
    }

    async set(obj: unknown) {
        const text = JSON.stringify(obj);
        
        try {
            return await fs.promises.writeFile(this.path, text);
        } catch (e) {
            if (e.code !== 'ENOENT') throw e;

            const route = this.path.split('/');
            await fs.promises.mkdir(route.slice(0, route.length - 1).join('/'));
        }

        return await fs.promises.writeFile(this.path, text);        
    }
}

export default FileStorage;