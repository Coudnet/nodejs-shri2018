const express = require('express');
const router = express.Router();
const fs = require("fs");

const pageSize = 2;

class ParamTypeError {
    constructor(errno, message) {
        this.errno = errno;
        this.message = message;
    }
}

const correctTypes = ['info', 'critical'];

router.get('/events', function(req, res) {

    try {
        checkParams(req.query.type, req.query.page);
        getData(req.query.type, req.query.page, res);
    } catch(error) {
        if(!error.errno) error.errno = 500;
        res.status(error.errno).json({
            data: null,
            pagination: null,
            error: {
                msg: error.message
            }
        })
    }
});

router.post('/events', function(req, res) {
    try {
        checkParams(req.body.type, req.body.page);
        getData(req.body.type, req.body.page, res);
    } catch(error) {
        if(!error.errno) error.errno = 500;
        res.status(error.errno).json({
            data: null,
            pagination: null,
            error: {
                msg: error.message
            }
        })
    }
});

function getData(type, page, res) {
    fs.readFile("events.json", "utf8",
        function(error, data) {
            if(error) throw error; // если возникла ошибка

            const dataJSON = JSON.parse(data);
            let dataPages = makePagination(dataJSON.events, type);

            const dataPagesNum = dataPages.length;
            if(page < 1) page = 1;
            if(page > dataPagesNum) page = dataPagesNum;

            res.json({
                data: dataPages[page - 1],
                error: null,
                pagination: {
                    prevPage: (page - 1) < 1 ? null : page - 1,
                    total: dataPagesNum,
                    nextPage: (page + 1) > dataPagesNum ? null : page + 1
                }
            });
        });
}

function checkParams(type) {
    if(correctTypes.indexOf(type) === -1) throw new ParamTypeError(400, 'Неверный тип параметра type');
}

function makePagination(events, type) {
    let dataPages = [];
    let j = 0;
    dataPages[j] = [];
    for (let i = 0; i < events.length; i++) {
        if(events[i].type === type) {
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