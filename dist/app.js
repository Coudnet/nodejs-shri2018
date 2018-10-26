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
const apiRoute = __importStar(require("./routes/api"));
const statusRoute = __importStar(require("./routes/status"));
const app = express_1.default();
const port = 8000;
app.set("port", port);
let server = http_1.default.createServer(app);
server.listen(port);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api/events", apiRoute.getEvents);
app.post("/api/events", apiRoute.postEvents);
app.get("/status", statusRoute.getUpTime);
app.use((req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
});
module.exports = app;
//# sourceMappingURL=app.js.map