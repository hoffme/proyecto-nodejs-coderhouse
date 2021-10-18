import Storage from '../storage';

import User, { CreateUserCMD } from '../models/user/model';

interface UserToken {
    access: string
}

interface SignInParams {
    email: string
    password: string
}

interface SignUpParams extends CreateUserCMD {};

class AuthController {

    public async signin(params: SignInParams): Promise<UserToken> {
        const user = await Storage.repositories.user.find({ email: params.email });
        if (!user) throw new Error('email not register');

        if (!user.validPassword(params.password)) {
            throw new Error('invalid password');
        }

        const token = await this.generateToken(user);

        return token;
    }

    public async signup(params: SignUpParams): Promise<UserToken> {
        let user = await Storage.repositories.user.find({ email: params.email });
        if (user) throw new Error('email alrady register');
    
        user = await Storage.repositories.user.create(params);

        const token = await this.generateToken(user);

        return token;
    }
    
    public async getUser(token: UserToken): Promise<User> {
        return Storage.repositories.user.find({ id: token.access });
    }

    public async logout(token: UserToken): Promise<void> {
        
    }

    // utils

    private async generateToken(user: User): Promise<UserToken> {
        return { access: user.id };
    }

}

export default AuthController;
export type {
    UserToken,
    SignInParams,
    SignUpParams
}