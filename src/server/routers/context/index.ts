import { UserToken } from "../../../controllers/auth";
import User from "../../../models/user/model";

class Context {

    private readonly _token?: UserToken;

    public get token(): UserToken {
        if (!this._token) throw new Error('user not logged');
        return this._token;
    }

    public get user(): User {
        if (!this._token) throw new Error('user not logged');
        return ({} as any); // TODO
    }

    public isAuthenticated(userType: string): boolean {
        return false;
    }

}

export default Context;