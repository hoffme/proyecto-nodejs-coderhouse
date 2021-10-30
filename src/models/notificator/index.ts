import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';

import ErrorManager from '../error';
import { Order } from '../order';
import { User } from '../user';

import NotificatorSettings from './settings';

class Notificator {
    
    private static settings: NotificatorSettings;
    private static mail?: Transporter;

    public static async setup(settings: NotificatorSettings): Promise<void> {
        Notificator.settings = settings;

        Notificator.createTransports();

        Notificator.listenEvents();
    }

    private static createTransports() {
        if (Notificator.settings.senders.mail) {
            Notificator.mail = nodemailer.createTransport({
                service: 'gmail',
                auth: Notificator.settings.senders.mail
            });
        }
    }

    private static listenEvents() {
        if (Notificator.settings.reciver.admin_mail) {
            User.on.create.listen(async (user) => {
                await Notificator.sendMail(
                    Notificator.settings.reciver.admin_mail!,
                    'Nuevo Usuario Registrado',
                    'register',
                    user.json()
                )
            })
            Order.on.create.listen(async (order) => {
                await Promise.all([
                    Notificator.sendMail(
                        Notificator.settings.reciver.admin_mail!,
                        'Nueva Orden',
                        'order',
                        order.json()
                    ),
                    Notificator.sendMail(
                        order.user.email,
                        'Orden Generada',
                        'order',
                        order.json()
                    )
                ])
            })
        }

        if (Notificator.settings.reciver.errors_mail) {
            ErrorManager.on.error.listen(async (error) => {
                await Notificator.sendMail(
                    Notificator.settings.reciver.admin_mail!,
                    'Error en el sistema',
                    'error',
                    error
                )
            })
        }
    }

    private static async sendMail(to: string, subject: string, template: string, params?: any) {
        if (!Notificator.mail) return;

        const html = await new Promise<string>((res, rej) => {
            ejs.renderFile(`./src/models/notificator/templates/${template}.ejs`, params, (err, html) => {
                if (err) rej(err);
                else res(html)
            });
        })

        await Notificator.mail.sendMail({
            from: Notificator.settings.senders.mail?.user,
            to: to,
            subject: subject,
            html
        })
    }
}

export default Notificator;
export type { NotificatorSettings };