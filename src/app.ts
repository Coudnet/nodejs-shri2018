import express from "express";
import { Request, Response } from "express";
import http from "http";
import {setHeadersMiddleware} from "./middleware/middleware";
import * as apiRoute from "./routes/api";
import * as pageRoute from "./routes/page";
import * as statusRoute from "./routes/status";

const app = express();

const port = 8000;

app.set("port", port);
let server = http.createServer(app);
server.listen(port);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(setHeadersMiddleware);

app.get("/api/events", apiRoute.getEvents);
app.get("/page", pageRoute.getPage);
app.post("/page", pageRoute.postPage);
app.post("/api/events", apiRoute.postEvents);
app.get("/status", statusRoute.getUpTime);

app.use((req: Request, res: Response) => {
    res.status(404).send("<h1>Page not found</h1>");
});

module.exports = app;
