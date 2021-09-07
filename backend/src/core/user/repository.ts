import EventCore from "../generics/events";
import { User } from "./model";

interface FilterUserCMD {
    id?: string
    email?: string
}

interface CreatUserCMD {
    name: string
    lastname: string
    email: string
    phone: string
    age: string
    avatar: string
    address: {
        country: string
        city: string
        street: string
        number: string
        aditional: string
    }
    hash: string
}

interface UpdateUserCMD {
    name?: string
    lastname?: string
    email?: string
    phone?: string
    age?: string
    avatar?: string
    address?: {
        country?: string
        city?: string
        street?: string
        number?: string
        aditional?: string
    }
    hash?: string
}

abstract class UserRepository {

    public readonly events: {
        create: EventCore<User>
        update: EventCore<User>
        remove: EventCore<User>
    }

    protected constructor() {
        this.events = {
            create: new EventCore('create'),
            update: new EventCore('update'),
            remove: new EventCore('remove'),
        }
    }

    public abstract setup(): Promise<void>

    public abstract find(filter: FilterUserCMD): Promise<User | undefined>

    public abstract create(cmd: CreatUserCMD): Promise<User>
    
    public abstract update(id: string, cmd: UpdateUserCMD): Promise<User>

    public abstract delete(id: string): Promise<User>
}

export default UserRepository;
export type {
    User,
    FilterUserCMD,
    CreatUserCMD,
    UpdateUserCMD
}