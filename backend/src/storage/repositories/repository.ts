import EventCore from "../../core/utils/events";

import { Identifiable } from "./identifiable";

interface Repository<T extends Identifiable> {
    events: {
        create: EventCore<T>
        update: EventCore<T>
        delete: EventCore<T>
    }

    create(obj: T): Promise<T>
    getById(id: string): Promise<T>
    getAll(): Promise<T[]>
    exist(id: string): Promise<boolean>
    update(id: string, update: T): Promise<T>
    delete(id: string): Promise<T>
}

export type { Repository };