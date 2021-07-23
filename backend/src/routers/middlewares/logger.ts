import { NextFunction, Request, Response } from "express";

const LoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${Date.now().toString()}: ${req.method} ${req.originalUrl} ${res.statusCode}`);
    next();
}

export default LoggerMiddleware;