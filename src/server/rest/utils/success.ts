import { Response } from "express";

const successResponse = (res: Response, obj: any = {}) => {
    res.status(200).json({ result: obj });
}

export default successResponse;