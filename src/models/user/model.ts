import bcrypt from 'bcrypt';

import { EventManager } from '../../utils/events';

import { CreateUserCMD, FilterUserCMD, UserAddressDTO, UserDAO, UserDTO } from "./dao";

interface UpdateUser {
    name?: string
    lastname?: string
    email?: string
    phone?: string
    age?: string
    avatar?: string
    address?: {
        country?: string
        city?: string
        street?: string
        number?: string
        aditional?: string
    }
}

interface CreateUser {
    name: string
    lastname: string
    email: string
    phone: string
    age: string
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
        const params: CreateUserCMD = {
            ...fields,
            avatar: '',
            address: {
                country: '',
                city: '',
                street: '',
                number: '',
                aditional: '',
            },
            hash: await bcrypt.hash(fields.password, 10)
        }

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
    public get name(): string { return this._data.name }
    public get lastname(): string { return this._data.lastname }
    public get email(): string { return this._data.email }
    public get phone(): string { return this._data.phone }
    public get age(): string { return this._data.age }
    public get avatar(): string { return this._data.avatar }
    public get address(): UserAddressDTO { return this._data.address }

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
            name: this._data.name || '',
            lastname: this._data.lastname || '',
            email: this._data.email || '',
            phone: this._data.phone || '',
            age: this._data.age || '',
            avatar: this._data.avatar || '',
            address: {
                country: this._data.address?.country || '',
                city: this._data.address?.city || '',
                street: this._data.address?.street || '',
                number: this._data.address?.number || '',
                aditional: this._data.address?.aditional || '',
            }
        }
    }

}

export default User;
export type {
    CreateUser as CreateUserCMD,
    UpdateUser as UpdateUserCMD,
    FilterUserCMD,
    UserAddressDTO as UserAddress
}