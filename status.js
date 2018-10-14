const express = require('express');
const router = express.Router();

const timeStart = Date.now(); // Время старта сервера

router.get('/', function(req, res) {

    const now = Date.now(); // Время запроса
    const dif = (now - timeStart) / 1000;
    let hours = Math.floor(dif / Math.pow(2, 60));
    let minutes = Math.floor((dif - hours * Math.pow(2, 60)) / 60);
    let seconds = Math.floor(dif - hours * Math.pow(2, 60) - minutes * 60);

    res.json({
        timeFromLaunch: `${hours}:${minutes}:${seconds}`
    });
});

module.exports = router;