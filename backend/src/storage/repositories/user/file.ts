import UserRepository, { CreatUserCMD, FilterUserCMD, UpdateUserCMD, User } from '../../../core/user/repository';

import FileSettings from '../../settings/file';

import FileStorage from '../../utils/file';

import uuid from '../../utils/uuid';

class UserFileRepository extends UserRepository {

    private file: FileStorage<User[]>

    constructor(settings: FileSettings) {
        super();

        this.file = new FileStorage(settings.path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch { await this.file.set([]) }
    }

    async find(filter: FilterUserCMD): Promise<User | undefined> {
        if (!filter.email && !filter.id) return undefined;

        const items = await this.file.get();
        
        const user = items.find(user => {
            if (filter.id && filter.id !== user.id) return false;
            if (filter.email && filter.email !== user.email) return false;

            return true;
        })
        if (!user) throw new Error(`user not found`);
        
        return user;
    }
    
    async create(cmd: CreatUserCMD): Promise<User> {
        const items = await this.file.get();

        const exist = items.find(u => u.email === cmd.email);
        if (exist) throw new Error('user already register');
        
        const user: User = {
            id: uuid(),
            ...cmd
        }
        items.push(user);

        await this.file.set(items);

        this.events.create.notify(user)

        return user;
    }

    async update(id: string, update: UpdateUserCMD): Promise<User> {
        let items = await this.file.get();
        
        let userUpdated: User | undefined = undefined;

        items = items.map(user => {
            if (user.id !== id) return user;

            const address = { address: { ...user.address } }
            if (update.address) {
                address.address = { ...address.address, ...update.address }
            }

            userUpdated = {
                ...user,
                ...update,
                ...address
            };

            return userUpdated;
        })

        if (!userUpdated) throw 'user not found';

        await this.file.set(items);

        this.events.update.notify(userUpdated)

        return userUpdated;
    }

    async delete(id: string): Promise<User> {
        const items = await this.file.get();

        const model = items.find(user => user.id === id);
        if (!model) throw 'user not found';

        await this.file.set(items);

        this.events.remove.notify(model)

        return model;
    }
}

export default UserFileRepository;