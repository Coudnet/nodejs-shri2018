import { NextFunction, Request, Response } from "express";
import {config} from "../config";

export let setHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:" + config.portCORSAllow);
    next();
};
