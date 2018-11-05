"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeStart = Date.now(); // Время старта сервера
exports.getUpTime = (req, res) => {
    const now = Date.now(); // Время запроса
    const dif = (now - timeStart) / 1000;
    let hours = Math.floor(dif / Math.pow(2, 60));
    let minutes = Math.floor((dif - hours * Math.pow(2, 60)) / 60);
    let seconds = Math.floor(dif - hours * Math.pow(2, 60) - minutes * 60);
    res.json({
        timeFromLaunch: `${hours}:${minutes}:${seconds}`,
    });
};
//# sourceMappingURL=status.js.map