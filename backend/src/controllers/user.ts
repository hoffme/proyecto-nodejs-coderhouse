import bcrypt from 'bcrypt';

import { CreateUser, UpdateUser, User, UserModel } from "../core/user/model";
import UserRepository, { CreatUserCMD, FilterUserCMD } from "../core/user/repository";

class UserController {

    private repository: UserRepository

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async verify(email: string, password: string): Promise<UserModel> {
        const user = await this.repository.find({ email });
        if (!user) throw new Error('user not found');

        if (!bcrypt.compareSync(password, user.hash)) {
            throw new Error('invalid password');
        }

        return this.toExternalUser(user);
    }

    async find(filter: FilterUserCMD): Promise<UserModel | undefined> {
        const user = await this.repository.find(filter);
        return user ? this.toExternalUser(user) : undefined;
    }

    async create(cmd: CreateUser): Promise<UserModel> {
        const hash = await bcrypt.hash(cmd.password, 10);

        const user = await this.repository.create(this.createUser(cmd, hash));

        return this.toExternalUser(user);
    }

    async update(id: string, update: UpdateUser): Promise<UserModel> {
        const user = await this.repository.update(id, update);
        return this.toExternalUser(user);
    }

    async delete(id: string): Promise<UserModel> {
        const user = await this.repository.delete(id);
        return this.toExternalUser(user);
    }

    private createUser(cmd: CreateUser, hash: string): CreatUserCMD {
        return {
            name: cmd.name || '',
            lastname: cmd.lastname || '',
            email: cmd.email || '',
            phone: cmd.phone || '',
            age: cmd.age || '',
            avatar: '',
            address: {
                country: '',
                city: '',
                street: '',
                number: '',
                aditional: '',
            },
            hash: hash,
        }
    }

    private toExternalUser(input: User): UserModel {
        return {
            id: input.id || '',
            name: input.name || '',
            lastname: input.lastname || '',
            email: input.email || '',
            phone: input.phone || '',
            age: input.age || '',
            avatar: input.avatar || '',
            address: {
                country: input.address?.country || '',
                city: input.address?.city || '',
                street: input.address?.street || '',
                number: input.address?.number || '',
                aditional: input.address?.aditional || '',
            }
        }
    }
}

export default UserController;