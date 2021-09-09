interface User {
    id: string
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

interface UserModel {
    id: string
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
}

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
    id: string
    name: string
    lastname: string
    email: string
    phone: string
    age: string
    password: string
}

export type {
    User,
    UserModel,
    UpdateUser,
    CreateUser
}