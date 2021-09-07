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

interface CreateUser {
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
    password: string
}

export type {
    User,
    CreateUser
}