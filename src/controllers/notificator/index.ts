import nodemailer, { Transporter } from 'nodemailer';
import twilio, { Twilio } from 'twilio';

import { Cart } from '../../models/cart';
import { User } from '../../models/user';

interface NotifierSettings {
    senders: {
        twilio?: {
            account_sid: string
            auth_token: string
            phone: string
        },
        mail?: {
            user: string
            pass: string
        }
    }
    reciver: {
        phone?: string
        mail?: string
    }
}

class NotifierController {
    
    private readonly settings: NotifierSettings
    private readonly mail?: Transporter;
    private readonly twilio?: Twilio;

    constructor(settings: NotifierSettings) {
        this.settings = settings;

        if (settings.senders.mail) {
            this.mail = nodemailer.createTransport({
                service: 'gmail',
                auth: settings.senders.mail
            });
        }
        if (settings.senders.twilio) {
            this.twilio = twilio(
                settings.senders.twilio.account_sid,
                settings.senders.twilio.auth_token
            )
        }
    }

    public async registerUser(user: User) {
        if (!this.settings.reciver.mail) return;
        
        await this.sendMail(
            this.settings.reciver.mail,
            'Nuevo Registro',
            user.json()
        );
    }

    public async orderCreated(user: User, cart: Cart) {
        if (this.settings.reciver.mail) {
            await this.sendMail(
                this.settings.reciver.mail,
                `Nuevo pedido de ${user.email} (${user.name} ${user.lastname})`,
                cart
            );
        }

        if (this.settings.reciver.phone) {
            await this.sendSMS(
                this.settings.reciver.phone,
                `Nuevo pedido de ${user.email} (${user.name} ${user.lastname})`
            )
        }

        if (user.phone) {
            await this.sendSMS(
                user.phone,
                'Hola, Gracias por la compra. Su pedido esta siendo procesado.'
            )
        }
    }
    
    private async sendMail(to: string, subject: string, message: any) {
        if (!this.mail) return;

        await this.mail.sendMail({
            from: this.settings.senders.mail?.user,
            to: to,
            subject: subject,
            html: JSON.stringify(message)
        })
    }

    private async sendWhatsapp(to: string, message: string) {
        if (!this.twilio) return;

        await this.twilio.messages.create({
            to: `whatsapp:${to}`,
            from: `whatsapp:${this.settings.senders.twilio}`,
            body: message
        })
    }

    private async sendSMS(to: string, message: string) {
        if (!this.twilio) return;

        await this.twilio.messages.create({
            from: this.settings.senders.twilio?.phone,
            to,
            body: message
        })
    }
}

export default NotifierController;
export type { NotifierSettings };