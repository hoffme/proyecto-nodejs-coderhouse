interface FilterMessageCMD {
    by?: MessageBy
    user_id?: string
    chat_id?: string
    from?: Date
    to?: Date
    limit?: number
    page?: number
}

interface CreateMessageCMD {
    by: MessageBy
    chat_id: string
    user: UserDTO
    body: string
}

interface UserDTO {
    id: string
    name: string
    email: string
    phone: string
}

type MessageBy = 'client' | 'seller'

interface MessageDTO {
    id: string
    timestamp: Date
    chat_id: string
    by: MessageBy
    user: UserDTO
    body: string
}

interface MessageDAO {
    find(id: String): Promise<MessageDTO>
    search(filter: FilterMessageCMD): Promise<MessageDTO[]>
    create(cmd: CreateMessageCMD): Promise<MessageDTO>
    delete(id: string): Promise<MessageDTO>
}

export type {
    FilterMessageCMD,
    CreateMessageCMD,
    UserDTO,
    MessageBy,
    MessageDTO,
    MessageDAO
}