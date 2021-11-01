import { User, CreateUser, UpdateUser } from '../../models/user';

import Controller from '../controller';

class UserController extends Controller {

    async find(id: string): Promise<User> {
        return Controller.secureMethod(async () => {
            return User.getById(id);
        });
    }

    async create(cmd: CreateUser): Promise<User> {
        return Controller.secureMethod(async () => {
            return User.create(cmd);
        });
    }

    async update(id: string, update: UpdateUser): Promise<User> {
        return Controller.secureMethod(async () => {
            delete update.type;

            const user = await User.getById(id);
            await user.update(update);
            return user;
        });
    }

    async delete(id: string): Promise<User> {
        return Controller.secureMethod(async () => {
            const user = await User.getById(id);
            await user.delete();
            return user;
        });
    }
}

export default UserController;