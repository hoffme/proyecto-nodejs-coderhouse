import EventCore from "../../core/utils/events";
import { Identifiable } from "./identifiable";
import { Repository } from "./repository";

class MemoryRepository<T extends Identifiable> implements Repository<T> {
    
    private index: T[];

    public readonly events: {
        create: EventCore<T>
        update: EventCore<T>
        delete: EventCore<T>
    }

    constructor() {
        this.index = [];

        this.events = {
            create: new EventCore("create"),
            update: new EventCore("update"),
            delete: new EventCore("delete")
        }
    }

    _newId() {
        return this.index.length.toString();
    }

    async create(obj: T) {
        const newobj: T = { ...obj, id: this._newId() };

        this.index.push(newobj);

        this.events.create.notify(newobj)
            .catch(err => console.error(`error oncreate event`, err))

        return newobj;
    }

    async getById(id: string) {
        const obj = this.index.find(obj => obj.id === id);
        if (!obj) throw new Error("not found");
        
        return obj;
    }

    async getAll() {
        return this.index.map(obj => ({ ...obj }));
    }

    async exist(id: string) {
        try { return !!await this.getById(id) } 
        catch { return false }
    }

    async update(id: string, update: T) {
        const obj = await this.getById(id);
        const objUpdated = { ...obj, ...update, id }

        this.index = this.index.map(obj => obj.id !== id ? obj : objUpdated);

        this.events.update.notify(objUpdated)
            .catch(err => console.error(`error onupdate event`, err))

        return objUpdated;
    }

    async delete(id: string) {
        const obj = await this.getById(id);

        this.index = this.index.filter(obj => obj.id !== id);

        this.events.delete.notify(obj)
            .catch(err => console.error(`error ondelete event`, err))

        return obj;
    }
}

export default MemoryRepository;