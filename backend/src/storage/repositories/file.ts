import EventCore from '../../core/utils/events';
import FileStorage from '../connections/file';
import { Identifiable } from './identifiable';
import { Repository } from './repository';

class FileRepository<T extends Identifiable> implements Repository<T> {

    private last_id: number
    private file: FileStorage

    public readonly events: {
        create: EventCore<T>,
        update: EventCore<T>,
        delete: EventCore<T>
    }

    constructor(path: string) {
        this.last_id = 0;

        this.file = new FileStorage(path);

        this.events = {
            create: new EventCore("create"),
            update: new EventCore("update"),
            delete: new EventCore("delete")
        }
    }

    async setup() {
        try {
            const data = await this.file.get();
            this.last_id = data.last_id;
            return;
        } catch (e) {}

        await this.file.set({ last_id: 0, items: {} });
    }

    _newId() {
        this.last_id += 1;
        return this.last_id.toString();
    }

    async create(obj: T) {
        const newModel = { ...obj, id: this._newId() };

        const items = (await this.file.get()).items;

        items[newModel.id] = newModel;

        await this.file.set({ last_id: this.last_id, items });

        this.events.create.notify(newModel)
            .catch(err => console.error(`error oncreate event`, err))

        return newModel;
    }

    async getById(id: string) {
        const items = (await this.file.get()).items;
        
        const model = items[id];
        if (!model) throw new Error(`not found`);
        
        return model;
    }

    async getAll() {
        const items: { [key: string]: T } = (await this.file.get()).items;
        return Array.from(Object.values(items));
    }

    async exist(id: string) {
        try {
            return !!await this.getById(id);
        } catch {
            return false;
        }
    }

    async update(id: string, update: T) {
        const items = (await this.file.get()).items;
        items[id] = { ...(items[id]), ...update };

        await this.file.set({ last_id: this.last_id, items });

        this.events.update.notify(items[id])
            .catch(err => console.error(`error onupdate event`, err))

        return items[id];
    }

    async delete(id: string) {
        const items = (await this.file.get()).items;

        const model = items[id];

        delete items[id];

        await this.file.set({ last_id: this.last_id, items });

        this.events.delete.notify(model)
            .catch(err => console.error(`error ondelete event`, err))

        return model;
    }
}

export default FileRepository;