import { User, CreateUser, UpdateUser } from '../../models/user';

import Controller from '../controller';

class UserController extends Controller {

    @Controller.method()
    async find(id: string): Promise<User> {
        return User.getById(id);
    }

    @Controller.method()
    async create(cmd: CreateUser): Promise<User> {
        return User.create(cmd);
    }

    @Controller.method()
    async update(id: string, update: UpdateUser): Promise<User> {
        const user = await User.getById(id);
        await user.update(update);
        return user;
    }

    @Controller.method()
    async delete(id: string): Promise<User> {
        const user = await User.getById(id);
        await user.delete();
        return user;
    }
}

export default UserController;