import { CreateUserCMD, FilterUserCMD, UpdateUserCMD, UserDAO, UserDTO } from '../../../core/user/dao';

import FileSettings from '../../settings/file';

import FileStorage from '../../utils/file';
import uuid from '../../utils/uuid';

class UserFileDAO implements UserDAO {

    private file: FileStorage<UserDTO[]>

    constructor(settings: FileSettings) {
        this.file = new FileStorage(settings.path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch { await this.file.set([]) }
    }

    async find(filter: FilterUserCMD): Promise<UserDTO> {
        const items = await this.file.get();
        
        const user = items.find(user => {
            if (filter.id && filter.id !== user.id) return false;
            if (filter.email && filter.email !== user.email) return false;

            return true;
        })
        if (!user) throw new Error(`user not found`);
        
        return user;
    }
    
    async create(cmd: CreateUserCMD): Promise<UserDTO> {
        const items = await this.file.get();

        const exist = items.find(u => u.email === cmd.email);
        if (exist) throw new Error('user already register');
        
        const user: UserDTO = {
            id: uuid(),
            ...cmd
        }
        items.push(user);

        await this.file.set(items);

        return user;
    }

    async update(id: string, update: UpdateUserCMD): Promise<UserDTO> {
        let items = await this.file.get();
        
        let userUpdated: UserDTO | undefined = undefined;

        items = items.map(user => {
            if (user.id !== id) return user;

            userUpdated = {
                id: user.id,
                name: update.name || user.name,
                lastname: update.lastname || user.lastname,
                phone: update.phone || user.phone,
                email: update.email || user.email,
                age: update.age || user.age,
                avatar: update.avatar || user.avatar,
                hash: update.hash || user.hash,
                address: {
                    country: update.address?.country || user.address.country,
                    city: update.address?.city || user.address.city,
                    street: update.address?.street || user.address.street,
                    number: update.address?.number || user.address.number,
                    aditional: update.address?.aditional || user.address.aditional,
                }
            };

            return userUpdated;
        })

        if (!userUpdated) throw 'user not found';

        await this.file.set(items);

        return userUpdated;
    }

    async delete(id: string): Promise<UserDTO> {
        const items = await this.file.get();

        const model = items.find(user => user.id === id);
        if (!model) throw 'user not found';

        await this.file.set(items);

        return model;
    }
}

export default UserFileDAO;