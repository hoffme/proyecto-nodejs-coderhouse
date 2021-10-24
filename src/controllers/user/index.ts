import { User, CreateUser, UpdateUser } from '../../models/user';

class UserController {

    async find(id: string): Promise<User> {
        return User.getById(id);
    }

    async create(cmd: CreateUser): Promise<User> {
        return User.create(cmd);
    }

    async update(id: string, update: UpdateUser): Promise<User> {
        const user = await User.getById(id);
        await user.update(update);
        return user;
    }

    async delete(id: string): Promise<User> {
        const user = await User.getById(id);
        await user.delete();
        return user;
    }
    
}

export default UserController;