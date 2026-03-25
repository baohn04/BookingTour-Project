import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SERVER_URL 
  || (process.env.REACT_APP_API_URL ? new URL(process.env.REACT_APP_API_URL).origin : "http://localhost:8080");

export const socket = io(SOCKET_URL);
