import { Request, Response } from "express";

let currentPage = 1;

export let getPage = (req: Request, res: Response) => {
    res.json({
        page: currentPage,
    });
};

export let postPage = (req: Request, res: Response) => {
    currentPage = +req.body.page;
    res.json({
        page: currentPage,
    });
};
