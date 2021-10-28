class Controller {

    public static async secureMethod<R>(func: () => Promise<R>): Promise<R> {
        return await func()
    }

}

export default Controller;