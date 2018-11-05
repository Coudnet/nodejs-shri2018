"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let currentPage = 1;
exports.getPage = (req, res) => {
    res.json({
        page: currentPage,
    });
};
exports.postPage = (req, res) => {
    currentPage = +req.body.page;
    res.json({
        page: currentPage,
    });
};
//# sourceMappingURL=page.js.map