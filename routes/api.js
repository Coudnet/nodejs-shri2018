const express = require('express');
const router = express.Router();
const fs = require("fs");

const pageSize = 10; // Размер страницы выдачи

const correctTypes = ['info', 'critical']; //  Массив корректных параметров

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

router.get('/events', function(req, res) {
    sendResponse(res, req.query.type, req.query.page);
});

router.post('/events', function(req, res) {
    sendResponse(res, req.body.type, req.body.page);
});

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

        if(params.page < 1) params.page = 1;
        if(params.page > dataPagesNum) params.page = dataPagesNum;

        res.json({
            data: dataPages[params.page - 1],
            error: null,
            pagination: {
                prevPage: ((params.page - 1) < 1) ? null : (params.page - 1),
                currentPage: params.page,
                total: dataPagesNum,
                nextPage: ((params.page + 1) > dataPagesNum) ? null : (params.page + 1)
            }
        });
    }).catch((error) => {
        sendError(res, error);
    })
}

function ReadFile() {
    return new Promise((resolve, reject) => {
        fs.readFile("events.json", "utf8", function(error, data) {
            if(error) reject(error);
            try {
                const dataJSON = JSON.parse(data);
                resolve(dataJSON);
            } catch(err) {
                reject(err)
            }
        });
    })
}

/**
 * Функция для отправки ошибки
 * @param res
 * @param error
 */
function sendError(res, error) {
    if(!error.errno) error.errno = 500;
    res.status(error.errno).json({
        data: null,
        pagination: null,
        error: {
            msg: error.message,
            code: error.errno
        }
    })
}


/**
 * Функция проверки и нормирования параметров
 * Если type отсутствует, то выбираются любые события
 * Проверка на корректный page. Пагинация есть всегда
 *
 * @param type
 * @param page
 * @returns {{type: String, page: number}}
 */
function checkParams(type, page) {
    if((correctTypes.indexOf(type) === -1) && type) throw new ParamTypeError(400, 'Неверный тип параметра type');
    if(!type) type = 'all';
    if(!page || isNaN(+page)) page = 1;

    return {
        type: type,
        page: +page
    }
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
    dataPages[j] = [];

    for (let i = 0; i < events.length; i++) {
        if(events[i].type === type || type === 'all') {
            dataPages[j].push(events[i]);
            if(!(dataPages[j].length % pageSize) && dataPages[j].length) {
                j++;
                dataPages[j] = [];
            }
        }

    }
    return dataPages;
}



module.exports = router;