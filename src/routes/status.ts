import { Request, Response } from "express";

const timeStart = Date.now(); // Время старта сервера

export let getUpTime = (req: Request, res: Response) => {

    const now: number = Date.now(); // Время запроса
    const dif: number = (now - timeStart) / 1000;
    let hours: number = Math.floor(dif / Math.pow(2, 60));
    let minutes: number = Math.floor((dif - hours * Math.pow(2, 60)) / 60);
    let seconds: number = Math.floor(dif - hours * Math.pow(2, 60) - minutes * 60);

    res.json({
        timeFromLaunch: `${hours}:${minutes}:${seconds}`,
    });
};
