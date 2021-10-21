interface FilterCartCMD {
    user_id?: string
}

interface ItemDTO {
    product_id: string
    quantity: number
    total: number
}

interface AddressDTO {
    city: string
    zip_code: string
    street: string
    number: string
    indications: string
}

interface CreateCartCMD {
    user_id: string
    items_ref: ItemDTO[]
    address: AddressDTO
    total: number
}

interface UpdateCartCMD {
    items_ref?: ItemDTO[]
    address?: AddressDTO
    total?: number
}

interface CartDTO {
    id: string
    user_id: string
    timestamp: Date
    items_ref: ItemDTO[]
    address: AddressDTO
    total: number
}

interface CartDAO {
    find(id: String): Promise<CartDTO>
    search(filter: FilterCartCMD): Promise<CartDTO[]>
    create(cmd: CreateCartCMD): Promise<CartDTO>
    update(id: string, cmd: UpdateCartCMD): Promise<CartDTO>
    delete(id: string): Promise<CartDTO>
}

export type {
    AddressDTO,
    FilterCartCMD,
    CreateCartCMD,
    UpdateCartCMD,
    ItemDTO,
    CartDTO,
    CartDAO
}