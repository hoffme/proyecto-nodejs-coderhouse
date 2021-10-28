import { Request } from "express";

import { User, UserType } from "../../../models/user";

import { UserToken } from "../../../controllers/auth";
import Controllers from "../../../controllers";

interface UserData {
    token: UserToken
    user: User
}

class Context {

    private readonly user_data?: UserData

    public static async build(req: Request): Promise<Context> {
        let data: UserData | undefined;

        const access = req.headers.authorization?.split(" ")[1];
        if (access) {
            const token: UserToken = { access };

            req.session.token = token;
            const user = await Controllers.auth.getUser(token);
            
            data = { token, user };
        }

        return new Context(data);
    }

    private constructor(data?: UserData) {
        this.user_data = data;
    }

    public get token(): UserToken {
        if (!this.user_data) throw new Error('user not logged');
        return this.user_data.token;
    }

    public get user(): User {
        if (!this.user_data) throw new Error('user not logged');
        return this.user_data.user;
    }

    public isAuthenticated(userType?: UserType): boolean {
        if (!this.user_data) throw new Error('user not logged');
        if (!userType) return true;
        
        return this.user_data.user.type === userType;
    }

}

export default Context;