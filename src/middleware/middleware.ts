import { NextFunction, Request, Response } from "express";

export let setHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    next();
};
