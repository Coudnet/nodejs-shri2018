"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pageSize = 10; // Размер страницы выдачи
const correctTypes = ["info", "critical"]; //  Массив корректных параметров
/**
 * Класс для генерации ошибки некорректного входного параметра
 * Нужен для добавления errno и удобного управления статусами ответа при ошибке
 */
class ParamTypeError {
    constructor(errno, message) {
        this.errno = errno;
        this.message = message;
    }
}
exports.getEvents = (req, res) => {
    sendResponse(res, req.query.type, req.query.page);
};
exports.postEvents = (req, res) => {
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
function sendResponse(res, type, page) {
    ReadFile().then((data) => {
        let params = checkParams(type, page);
        let dataPages = makePagination(data.events, params.type);
        const dataPagesNum = dataPages.length;
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
    }).catch((error) => {
        sendError(res, new ParamTypeError(500, error.message));
    });
}
function ReadFile() {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile("events.json", "utf8", (error, data) => {
            if (error) {
                reject(error);
            }
            try {
                const dataJSON = JSON.parse(data);
                resolve(dataJSON);
            }
            catch (err) {
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
function sendError(res, error) {
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
function checkParams(type, strPage) {
    let page = +strPage;
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
function makePagination(events, type) {
    let dataPages = [];
    let j = 0;
    let i;
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
//# sourceMappingURL=api.js.map