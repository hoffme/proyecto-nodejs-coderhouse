import User, { CreateUserCMD, FilterUserCMD, UpdateUserCMD } from '../models/user/model';
import UserRepository from '../models/user/repository';

class UserController {

    private repository: UserRepository = new UserRepository();

    async verify(email: string, password: string): Promise<User> {
        const user = await this.repository.find({ email });
        if (!user) throw new Error('user not found');

        if (!user.validPassword(password)) {
            throw new Error('invalid password');
        }

        return user;
    }

    async find(filter: FilterUserCMD): Promise<User> {
        return this.repository.find(filter);
    }

    async create(cmd: CreateUserCMD): Promise<User> {
        return this.repository.create(cmd);
    }

    async update(id: string, update: UpdateUserCMD): Promise<User> {
        return this.repository.update(id, update);
    }

    async delete(id: string): Promise<User> {
        return this.repository.delete(id);
    }
    
}

export default UserController;