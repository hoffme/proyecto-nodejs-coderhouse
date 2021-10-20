import User, { CreateUserCMD, FilterUserCMD, UpdateUserCMD } from "./model";

class UserRepository {

    public async find(filter: FilterUserCMD): Promise<User> {
        return User.search(filter);
    }

    public async create(cmd: CreateUserCMD): Promise<User> {
        return User.create(cmd);
    }
    
    public async update(id: string, cmd: UpdateUserCMD): Promise<User> {
        const user = await User.getById(id);
        await user.update(cmd);
        
        return user;
    }

    public async delete(id: string): Promise<User> {
        const user = await User.getById(id);
        await user.delete();
        
        return user;
    }
}

export default UserRepository;
export type {
    FilterUserCMD,
    CreateUserCMD,
    UpdateUserCMD
}