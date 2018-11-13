"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeadersMiddleware = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    next();
};
//# sourceMappingURL=middleware.js.map