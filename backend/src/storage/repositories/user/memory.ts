import UserRepository, { CreatUserCMD, FilterUserCMD, UpdateUserCMD, User } from '../../../core/user/repository';

import MemorySettings from '../../settings/memory';

import uuid from '../../utils/uuid';

class UserMemoryRepository extends UserRepository {

    private items: User[];
    
    constructor(settings: MemorySettings) {
        super();

        this.items = [];
    }

    async setup(): Promise<void> {}
    
    async find(filter: FilterUserCMD): Promise<User | undefined> {
        if (!filter.email && !filter.id) return undefined;
        
        const user = this.items.find(user => {
            if (filter.id && filter.id !== user.id) return false;
            if (filter.email && filter.email !== user.email) return false;

            return true;
        })
        if (!user) throw new Error(`user not found`);
        
        return user;
    }

    async create(cmd: CreatUserCMD): Promise<User> {
        const exist = this.items.find(u => u.email === cmd.email);
        if (exist) throw new Error('user already register');

        const user: User = {
            id: uuid(),
            ...cmd
        }

        this.items.push(user);

        this.events.create.notify(user)

        return user;
    }

    async update(id: string, update: UpdateUserCMD): Promise<User> {
        let userUpdated: User | undefined = undefined;

        this.items = this.items.map(user => {
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

        this.events.update.notify(userUpdated)

        return userUpdated;
    }

    async delete(id: string): Promise<User> {
        let userDelete: User | undefined;
        
        this.items = this.items.filter(user => {
            if (user.id !== id) return true;

            userDelete = user;

            return false;
        });
        if (!userDelete) throw 'user not found';

        this.events.remove.notify(userDelete);

        return userDelete;
    }

}

export default UserMemoryRepository;