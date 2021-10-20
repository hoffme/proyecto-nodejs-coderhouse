import { DAOMemorySettings } from '../../../models/storage/settings';

import { CreateUserCMD, FilterUserCMD, UpdateUserCMD, UserDAO, UserDTO } from '../../../models/user/dao';

import uuid from '../../../utils/uuid';

class UserMemoryDAO implements UserDAO {

    private items: UserDTO[];
    
    constructor(settings: DAOMemorySettings) {
        this.items = [];
    }

    async setup(): Promise<void> {}
    
    async find(filter: FilterUserCMD): Promise<UserDTO> {
        const user = this.items.find(user => {
            if (filter.id && filter.id !== user.id) return false;
            if (filter.email && filter.email !== user.email) return false;

            return true;
        })
        if (!user) throw new Error(`user not found`);
        
        return user;
    }

    async create(cmd: CreateUserCMD): Promise<UserDTO> {
        const exist = this.items.find(u => u.email === cmd.email);
        if (exist) throw new Error('user already register');

        const user: UserDTO = {
            id: uuid(),
            ...cmd
        }

        this.items.push(user);

        return user;
    }

    async update(id: string, update: UpdateUserCMD): Promise<UserDTO> {
        let userUpdated: UserDTO | undefined = undefined;

        this.items = this.items.map(user => {
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

        return userUpdated;
    }

    async delete(id: string): Promise<UserDTO> {
        let userDelete: UserDTO | undefined;
        
        this.items = this.items.filter(user => {
            if (user.id !== id) return true;

            userDelete = user;

            return false;
        });
        if (!userDelete) throw 'user not found';

        return userDelete;
    }

}

export default UserMemoryDAO;