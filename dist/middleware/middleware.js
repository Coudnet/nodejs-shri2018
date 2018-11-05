"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeadersMiddleware = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8081");
    next();
};
//# sourceMappingURL=middleware.js.map