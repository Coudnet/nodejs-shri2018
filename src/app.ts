import express from "express";
import { Request, Response } from "express";
import http from "http";
import * as apiRoute from "./routes/api";
import * as statusRoute from "./routes/status";

const app = express();

const port = 8000;

app.set("port", port);
let server = http.createServer(app);
server.listen(port);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/api/events", apiRoute.getEvents);
app.post("/api/events", apiRoute.postEvents);
app.get("/status", statusRoute.getUpTime);

app.use((req: Request, res: Response) => {
    res.status(404).send("<h1>Page not found</h1>");
});

module.exports = app;
