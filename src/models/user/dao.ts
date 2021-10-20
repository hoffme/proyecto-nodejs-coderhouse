interface UserDTO {
    id: string
    type: string
    name: string
    lastname: string
    email: string
    phone: string
    hash: string
}

interface FilterUserCMD {
    id?: string
    email?: string
    phone?: string
}

interface CreateUserCMD {
    type: string
    name: string
    lastname: string
    email: string
    phone: string
    hash: string
}

interface UpdateUserCMD {
    type?: string
    name?: string
    lastname?: string
    email?: string
    phone?: string
    hash?: string
}

interface UserDAO {
    find(filter: FilterUserCMD): Promise<UserDTO>
    create(cmd: CreateUserCMD): Promise<UserDTO>
    update(id: string, cmd: UpdateUserCMD): Promise<UserDTO>
    delete(id: string): Promise<UserDTO>
}

export type {
    UserDTO,
    FilterUserCMD,
    CreateUserCMD,
    UpdateUserCMD,
    UserDAO
}