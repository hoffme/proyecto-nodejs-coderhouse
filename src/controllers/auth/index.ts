import jwt from 'jsonwebtoken';

import { User, CreateUser } from '../../models/user';

import Controller from '../controller';

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

interface SignUpParams extends CreateUser {};

interface AuthSettings {
    jwt_secret: string
}

class AuthController extends Controller {

    private readonly settings: AuthSettings;

    constructor(settings: AuthSettings) {
        super();

        this.settings = settings;
    }

    @Controller.method()
    public async signin(params: SignInParams): Promise<UserToken> {
        const user = await User.search({ email: params.email });
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

    @Controller.method()
    public async signup(params: SignUpParams): Promise<void> {
        let user = await User.search({ email: params.email });
        if (user) throw new Error('email alrady register');
    
        await User.create(params);
    }
    
    @Controller.method()
    public async getUser(token: UserToken): Promise<User> {
        const fields = await this.decodeToken(token);
        
        return User.search({ id: fields.id });
    }

    @Controller.method()
    public async logout(token: UserToken): Promise<void> {}

    @Controller.method()
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