import jwt from 'jsonwebtoken';

import Storage from '../storage';

import User, { CreateUserCMD } from '../models/user/model';

interface UserToken {
    access: string
}

interface UserTokenFields {
    id: string
    role: 'admin' | 'client'
}

interface SignInParams {
    email: string
    password: string
}

interface SignUpParams extends CreateUserCMD {};

interface AuthSettings {
    jwt_secret: string
}

class AuthController {

    private readonly settings: AuthSettings;

    constructor(settings: AuthSettings) {
        this.settings = settings;
    }

    public async signin(params: SignInParams): Promise<UserToken> {
        const user = await Storage.repositories.user.find({ email: params.email });
        if (!user) throw new Error('email not register');

        if (!user.validPassword(params.password)) {
            throw new Error('invalid password');
        }

        const token = await this.encodeToken({
            id: user.id,
            role: 'client'
        });

        return token;
    }

    public async signup(params: SignUpParams): Promise<void> {
        let user = await Storage.repositories.user.find({ email: params.email });
        if (user) throw new Error('email alrady register');
    
        await Storage.repositories.user.create(params);
    }
    
    public async getUser(token: UserToken): Promise<User> {
        const fields = await this.decodeToken(token);
        
        return Storage.repositories.user.find({ id: fields.id });
    }

    public async logout(token: UserToken): Promise<void> {}

    public async verifyToken(token: UserToken): Promise<boolean> {
        jwt.verify(token.access, this.settings.jwt_secret);
        return true;
    }

    // utils

    private async encodeToken(fields: UserTokenFields): Promise<UserToken> {
        const access = jwt.sign(fields, this.settings.jwt_secret);
        return { access };
    }

    private async decodeToken(token: UserToken): Promise<UserTokenFields> {
        const fields: any = jwt.decode(token.access);
        return fields;
    }

}

export default AuthController;
export type {
    UserToken,
    SignInParams,
    SignUpParams,
    AuthSettings
}