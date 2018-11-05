import { Request, Response } from "express";
import fs from "fs";
import {IApplicationInternalError, IApplicationParams, IDataSmartHomeEvents, ISmartHomeEvent} from "./interfaces";


const pageSize: number = 30; // Размер страницы выдачи

const correctTypes: string[] = ["info", "critical"]; //  Массив корректных параметров

/**
 * Класс для генерации ошибки некорректного входного параметра
 * Нужен для добавления errno и удобного управления статусами ответа при ошибке
 */
class ParamTypeError implements IApplicationInternalError {
    public errno: number;
    public message: string;

    constructor(errno: number, message: string) {
        this.errno = errno;
        this.message = message;
    }
}

export let getEvents = (req: Request, res: Response) => {
    sendResponse(res, req.query.type, req.query.page);
};

export let postEvents = (req: Request, res: Response) => {
    sendResponse(res, req.body.type, req.body.page);
};

/**
 * Функция обработчик запроса
 * Выполняет асинхронное чтение json, вызывает функцию для разбиения данных на страницы и
 * формирует ответ с пагинацией
 * @param type
 * @param page
 * @param res
 */
function sendResponse(res: Response, type: string, page: string): void {
    ReadFile().then((data: IDataSmartHomeEvents) => {

        let params: IApplicationParams = checkParams(type, page);
        let dataPages: ISmartHomeEvent[][] = makePagination(data.events, params.type);

        const dataPagesNum: number = dataPages.length;

        if (params.page < 1) {
            params.page = 1;
        }
        if (params.page > dataPagesNum) {
            params.page = dataPagesNum;
        }

        res.json({
            data: dataPages[params.page - 1],
            error: null,
            pagination: {
                currentPage: params.page,
                nextPage: ((params.page + 1) > dataPagesNum) ? null : (params.page + 1),
                prevPage: ((params.page - 1) < 1) ? null : (params.page - 1),
                total: dataPagesNum,
            },
        });
    }).catch((error: Error) => {
        sendError(res, new ParamTypeError(500, error.message));
    });
}

function ReadFile() {
    return new Promise<IDataSmartHomeEvents>((resolve, reject) => {
        fs.readFile("events.json", "utf8", (error: Error, data: string) => {
            if (error) {
                reject(error);
            }
            try {
                const dataJSON: IDataSmartHomeEvents = JSON.parse(data);
                resolve(dataJSON);
            } catch (err) {
                reject(err);
            }
        });
    });
}

/**
 * Функция для отправки ошибки
 * @param res
 * @param error
 */
function sendError(res: Response, error: IApplicationInternalError): void {
    res.status(error.errno).json({
        data: null,
        error: {
            code: error.errno,
            msg: error.message,
        },
        pagination: null,
    });
}


/**
 * Функция проверки и нормирования параметров
 * Если type отсутствует, то выбираются любые события
 * Проверка на корректный page. Пагинация есть всегда
 *
 * @param type
 * @param strPage
 * @returns {{type: String, page: number}}
 */
function checkParams(type: string, strPage: string): IApplicationParams {
    let page: number = +strPage;
    if ((correctTypes.indexOf(type) === -1) && type) {
        throw new ParamTypeError(400, "Неверный тип параметра type");
    }
    if (!type) {
        type = "all";
    }
    if (!page || isNaN(+page)) {
        page = 1;
    }

    return {
        type,
        page,
    };
}

/**
 * Функция для разбиения на страницы с одновременной сортировкой по нужному типу
 * @param events
 * @param type
 * @returns {Array}
 */
function makePagination(events: ISmartHomeEvent[], type: string): ISmartHomeEvent[][] {
    let dataPages: ISmartHomeEvent[][] = [];
    let j: number = 0;
    let i: number;
    dataPages[j] = [];

    for (i = 0; i < events.length; i++) {
        if (events[i].type === type || type === "all") {
            dataPages[j].push(events[i]);
            if (!(dataPages[j].length % pageSize) && dataPages[j].length) {
                j++;
                dataPages[j] = [];
            }
        }
    }
    return dataPages;
}

