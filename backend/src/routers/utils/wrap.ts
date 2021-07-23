import { NextFunction, Request, Response } from "express";

import successResponse from "../responses/success";

const wrap = (handler: (req: Request) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req)
            .then(result => successResponse(res, result))
            .catch(next)
    }
}

export default wrap;