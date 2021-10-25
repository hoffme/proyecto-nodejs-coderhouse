interface NotificatorSettings {
    senders: {
        mail?: {
            user: string
            pass: string
        }
    }
    reciver: {
        admin_mail?: string
        errors_mail?: string
    }
}

export default NotificatorSettings;