interface ResponseHTTP<R> {
    result: R
    error?: string
}

class FetchManager {

    private readonly uri: string;

    constructor() {
        this.uri = 'http://localhost:4000/api';
    }

    public async fetch<R, B>(uri: string, method = 'GET', body: B): Promise<R> {
        const response = await fetch(`${this.uri}/${uri}`, {
            method,
            body: JSON.stringify(body)
        })

        const res: ResponseHTTP<R> = await response.json();
        if (res.error) throw new Error(res.error);

        return res.result;
    }
}

export default FetchManager;