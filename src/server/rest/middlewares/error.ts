import { ErrorRequestHandler } from "express";

import errorResponse from "../utils/error";

const error: ErrorRequestHandler = (error, req, res, next) => {
    if (error) return errorResponse(res, error.message);
    next();
}

export default error;