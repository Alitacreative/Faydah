export interface Channel {
    id: number
    name: string
    unread: number
}

export interface Message {
    id: number
    user: {
        name: string
        avatar: string
        role: string
    }
    message: string
    timestamp: Date
    isCurrentUser?: boolean
    status: string
}

export interface OnlineUser {
    name: string
    avatar: string
    role: string
    isOnline: boolean
}