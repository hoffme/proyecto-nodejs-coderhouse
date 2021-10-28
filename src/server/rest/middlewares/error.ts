import { ErrorRequestHandler } from "express";

import ErrorManager from "../../../models/error";

import errorResponse from "../utils/error";

const error: ErrorRequestHandler = (error, req, res, next) => {
    if (error) {
        ErrorManager.public({
            message: error.message,
            trace: error.trace,
            raw: error
        });
    
        return errorResponse(res, error.message);
    }

    next();
}

export default error;