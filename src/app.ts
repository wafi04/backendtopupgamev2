import express, { Express } from "express";
import cookieParser from "cookie-parser";
import router from "./routes";
import { ConfigEnv } from "./config/env";
import cors from "cors";
import { createServer } from "http";
import { setupSocket } from "./lib/websockets/socket";

const app: Express = express();
const port = ConfigEnv().PORT || 4000;
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

setupSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

server.listen(port, () => {
  console.log(`⚡️[server]: Server berjalan di http://localhost:${port}`);
});
