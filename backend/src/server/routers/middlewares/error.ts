import { ErrorRequestHandler } from "express";

const error: ErrorRequestHandler = (error, req, res, next) => {
    if (error) {
        console.error(error);
        const data = { error: error.message };
        res.status(400).json(data);
    }

    next();
}

export default error;