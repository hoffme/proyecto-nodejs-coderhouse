interface FilterCartCMD {
    user_id?: string
}

interface CreateCartCMD {
    user_id: string
}

interface UpdateCartCMD {
    user_id?: string
}

interface ItemDTO {
    product_id: string
    count: number
}

interface CartDTO {
    id: string
    user_id: string
    timestamp: Date
    items_ref: ItemDTO[]
}

interface CartDAO {
    find(id: String): Promise<CartDTO>
    search(filter: FilterCartCMD): Promise<CartDTO[]>

    create(cmd: CreateCartCMD): Promise<CartDTO>
    update(id: string, cmd: UpdateCartCMD): Promise<CartDTO>
    clear(id: string): Promise<CartDTO>

    setItem(id: string, item: ItemDTO): Promise<ItemDTO>
    remItem(id: string, product_id: string): Promise<ItemDTO>
}

export type {
    FilterCartCMD,
    CreateCartCMD,
    UpdateCartCMD,
    ItemDTO,
    CartDTO,
    CartDAO
}