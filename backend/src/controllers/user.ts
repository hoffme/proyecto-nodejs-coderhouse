import bcrypt from 'bcrypt';

import { CreateUser } from "../core/user/model";
import UserRepository, { CreatUserCMD, FilterUserCMD, UpdateUserCMD, User } from "../core/user/repository";

class UserController {

    private repository: UserRepository

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async verify(email: string, password: string): Promise<User> {
        const user = await this.find({ email });
        if (!user) throw new Error('user not found');

        if (!bcrypt.compareSync(password, user.hash)) {
            throw new Error('invalid password');
        }

        return user;
    }

    async find(filter: FilterUserCMD): Promise<User | undefined> {
        return await this.repository.find(filter);
    }

    async create(cmd: CreateUser): Promise<User> {
        const hash = await bcrypt.hash(cmd.password, 10);

        const cmdN = { ...cmd, password: undefined };

        return await this.repository.create({
            ...cmdN,
            hash
        });
    }

    async update(id: string, update: UpdateUserCMD): Promise<User> {
        return await this.repository.update(id, update);
    }

    async delete(id: string): Promise<User> {
        return await this.repository.delete(id);
    }
}

export default UserController;