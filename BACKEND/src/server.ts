import {env} from "./config/env.js";
import app from "./app.js";
import http from "http";
import {Server} from "socket.io";

const server = http.createServer(app);
const io = new Server(server)

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
})

export const socketIO = io;