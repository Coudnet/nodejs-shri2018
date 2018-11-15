"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
exports.setHeadersMiddleware = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:" + config_1.config.portCORSAllow);
    next();
};
//# sourceMappingURL=middleware.js.map