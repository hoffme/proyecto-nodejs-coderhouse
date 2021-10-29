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

const encodeToken = (fields: UserTokenFields, secret: string): UserToken => {
    const access = jwt.sign(fields, secret);
    return { access };
}

const decodeToken = (token: UserToken): UserTokenFields => {
    const fields: any = jwt.decode(token.access);
    return fields;
}

class AuthController extends Controller {

    private readonly settings: AuthSettings;

    constructor(settings: AuthSettings) {
        super();

        this.settings = settings;
    }

    public async signin(params: SignInParams): Promise<UserToken> {
        return Controller.secureMethod(async () => {
            const user = await User.search({ email: params.email });
            if (!user) throw new Error('email not register');

            if (!user.validPassword(params.password)) {
                throw new Error('invalid password');
            }

            const token = encodeToken({
                id: user.id,
                role: 'client'
            }, this.settings.jwt_secret);

            return token;
        });
    }

    public async signup(params: SignUpParams): Promise<void> {
        return Controller.secureMethod(async () => {
            try {
                await User.search({ email: params.email });
                throw new Error('email alrady register');
            } catch (e) {}
        
            await User.create({ ...params, type: 'client' });
        });
    }
    
    public async getUser(token: UserToken): Promise<User> {
        return Controller.secureMethod(async () => {
            const fields = decodeToken(token);
        
            return User.search({ id: fields.id });
        });
    }

    public async logout(token: UserToken): Promise<void> {
        return Controller.secureMethod(async () => {});
    }

    public async verifyToken(token: UserToken): Promise<boolean> {
        return Controller.secureMethod(async () => {
            jwt.verify(token.access, this.settings.jwt_secret);
            return true;
        });
    }

}

export default AuthController;
export type {
    UserToken,
    SignInParams,
    SignUpParams,
    AuthSettings
}