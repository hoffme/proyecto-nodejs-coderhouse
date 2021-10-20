import Storage from '../storage';

import User, { CreateUserCMD, FilterUserCMD, UpdateUserCMD } from '../models/user/model';

class UserController {

    async find(filter: FilterUserCMD): Promise<User> {
        return Storage.repositories.user.find(filter);
    }

    async create(cmd: CreateUserCMD): Promise<User> {
        return Storage.repositories.user.create(cmd);
    }

    async update(id: string, update: UpdateUserCMD): Promise<User> {
        return Storage.repositories.user.update(id, update);
    }

    async delete(id: string): Promise<User> {
        return Storage.repositories.user.delete(id);
    }
    
}

export default UserController;