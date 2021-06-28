import { Response } from "express";

const response = (res: Response, obj = {}) => {
    res.status(200).json({ result: obj });
}

export default response;