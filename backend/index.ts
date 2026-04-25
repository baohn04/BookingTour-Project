import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import orderSocket from "./api/v1/sockets/client/order.socket";

import * as database from "./config/database";
import clientV1Routes from "./api/v1/routes/client/index.route";
import adminV1Routes from "./api/v1/routes/admin/index.route";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SocketIO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
});
declare global {
  var _io: Server; 
}
global._io = io;

// Đăng ký socket handlers
orderSocket(io);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Cookie Parser (for JWT tokens)
app.use(cookieParser(process.env.TRAVELLAND_SECRET));

// API Routes
clientV1Routes(app);
adminV1Routes(app);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});