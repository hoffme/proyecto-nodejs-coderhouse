interface UserAddressDTO {
    country: string
    city: string
    street: string
    number: string
    aditional: string
}

interface UserDTO {
    id: string
    name: string
    lastname: string
    email: string
    phone: string
    age: string
    avatar: string
    address: UserAddressDTO
    hash: string
}

interface FilterUserCMD {
    id?: string
    email?: string
}

interface CreateUserCMD {
    name: string
    lastname: string
    email: string
    phone: string
    age: string
    avatar: string
    address: {
        country: string
        city: string
        street: string
        number: string
        aditional: string
    }
    hash: string
}

interface UpdateUserCMD {
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
    hash?: string
}

interface UserDAO {
    find(filter: FilterUserCMD): Promise<UserDTO>
    create(cmd: CreateUserCMD): Promise<UserDTO>
    update(id: string, cmd: UpdateUserCMD): Promise<UserDTO>
    delete(id: string): Promise<UserDTO>
}

export type {
    UserAddressDTO,
    UserDTO,
    FilterUserCMD,
    CreateUserCMD,
    UpdateUserCMD,
    UserDAO
}