import cors from "cors";
import createError from "http-errors";
import express from "express";
import http from "http";
import path from "path";
import "./firebase";
import roomRouter from "./routes/room";
import { fetchEmojis } from "./data/emoji-set";
import * as Rooms from "./actions/rooms";
import { Server, Socket } from "socket.io";
import { gameEvents } from "./events/game";
import { helperEvents } from "./events/helper";
import { lobbyEvents } from "./events/lobby";
import { pictionaryEvents } from "./events/pictionary";
import { playerEvents } from "./events/player";

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.static(path.join(process.cwd(), "./client/build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

// Fetch emoji data from Google Sheets
const fetchEmojisFromGoogleSheets = async () => {
  try {
    const emojis = await fetchEmojis();
    Rooms.setEmojis(emojis);
  } catch (e) {
    console.error(
      `Could not fetch emoji sets from Google Sheets. ${(e as Error).message}`
    );
  }
};

// Socket IO
const io = new Server(server, {
  path: "/moji.io",
  cors: {
    origin: ["https://www.mojiparty.io", "http://localhost:3000"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  playerEvents(io, socket);
  lobbyEvents(io, socket);
  gameEvents(io, socket);
  pictionaryEvents(io, socket);
  helperEvents(io, socket);
});

// Create, join room routes
app.use("/room", roomRouter);

app.get("/*", (_, res) => {
  res.sendFile(path.join(process.cwd(), "./client/build", "index.html"));
});

// Error handling
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  next(createError(404));
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
  fetchEmojisFromGoogleSheets();
});
