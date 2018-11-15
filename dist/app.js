"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const middleware_1 = require("./middleware/middleware");
const apiRoute = __importStar(require("./routes/api"));
const pageRoute = __importStar(require("./routes/page"));
const statusRoute = __importStar(require("./routes/status"));
const app = express_1.default();
app.set("port", config_1.config.port);
let server = http_1.default.createServer(app);
server.listen(config_1.config.port);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(middleware_1.setHeadersMiddleware);
app.get("/api/events", apiRoute.getEvents);
app.get("/page", pageRoute.getPage);
app.post("/page", pageRoute.postPage);
app.post("/api/events", apiRoute.postEvents);
app.get("/status", statusRoute.getUpTime);
app.use((req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
});
module.exports = app;
//# sourceMappingURL=app.js.map