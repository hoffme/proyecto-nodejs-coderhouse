import bcrypt from 'bcrypt';

import { EventManager } from '../../utils/events';

import { FilterUserCMD, UserDAO, UserDTO } from "./dao";

type UserType = 'admin' | 'client';

interface UpdateUser {
    type?: UserType
    name?: string
    lastname?: string
    email?: string
    phone?: string
}

interface CreateUser {
    type: UserType
    name: string
    lastname: string
    email: string
    phone: string
    password: string
}

class User {
    
    private static dao: UserDAO;

    public static readonly events = {
        create: new EventManager<User>(),
        update: new EventManager<User>(),
        delete: new EventManager<User>()
    }

    public static get on() {
        return {
            create: this.events.create.register,
            update: this.events.update.register,
            delete: this.events.delete.register
        }
    }
    
    private _data: UserDTO;
    private _deleted: boolean;

    public static async getById(id: string): Promise<User> {
        const dto = await User.dao.find({ id });
        return new User(dto);
    }

    public static async search(filter: FilterUserCMD): Promise<User> {
        const dto = await User.dao.find(filter);
        return new User(dto);
    }

    public static async create(fields: CreateUser): Promise<User> {
        const params: any = {
            ...fields,
            hash: await bcrypt.hash(fields.password, 10)
        }

        delete params['password'];

        const dto = await User.dao.create(params);
        const user = new User(dto);
    
        User.events.create.notify(user);

        return user;
    }

    public static setDAO(dao: UserDAO) {
        this.dao = dao;
    }

    private constructor(data: UserDTO) {
        this._data = data;
        this._deleted = false;
    }
    
    public get id(): string { return this._data.id }
    public get type(): string { return this._data.type }
    public get name(): string { return this._data.name }
    public get lastname(): string { return this._data.lastname }
    public get email(): string { return this._data.email }
    public get phone(): string { return this._data.phone }
    public get deleted(): boolean { return this._deleted }

    public async update(fields: UpdateUser): Promise<void> {
        this._data = await User.dao.update(this._data.id, fields);
    
        User.events.update.notify(this);
    }

    public async delete(): Promise<void> {
        await User.dao.delete(this._data.id);
        this._deleted = true;
    
        User.events.delete.notify(this);
    }

    public validPassword(password: string): boolean {
        return bcrypt.compareSync(password, this._data.hash);
    }

    public json() {
        return {
            id: this._data.id || '',
            type: this._data.type || '',
            name: this._data.name || '',
            lastname: this._data.lastname || '',
            email: this._data.email || '',
            phone: this._data.phone || ''
        }
    }

}

export default User;
export type {
    UserType,
    CreateUser as CreateUserCMD,
    UpdateUser as UpdateUserCMD,
    FilterUserCMD
}