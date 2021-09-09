import { Response } from "express";

const errorResponse = (res: Response, message: string, status = 400) => {
    res.status(status).json({ error: { message } });
}

export default errorResponse;