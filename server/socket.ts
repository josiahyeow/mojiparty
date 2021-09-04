import { Server, Socket } from "socket.io";
import { playerEvents } from "./events/player";
import { lobbyEvents } from "./events/lobby";
import { gameEvents } from "./events/game";
import { pictionaryEvents } from "./events/pictionary";
import { helperEvents } from "./events/helper";
import http from "http";

const socket = (server: http.Server) => {
  const io = new Server(server, {
    perMessageDeflate: false,
    pingTimeout: 15000,
  });

  io.on("connection", (socket: Socket) => {
    playerEvents(io, socket);
    lobbyEvents(io, socket);
    gameEvents(io, socket);
    pictionaryEvents(io, socket);
    helperEvents(io, socket);
  });
};

export { socket };
