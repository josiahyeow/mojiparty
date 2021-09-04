import express from "express";
import { db } from "../firebase";
import * as rooms from "../actions/rooms";

const router = express.Router();

router.get("/", async (req, res) => {
  const roomName = req.query.roomName;
  try {
    if (!roomName) {
      res.status(400).send({ error: "Missing room name" });
    }
    const room = (await db.ref("rooms/" + roomName).get()).val();
    rooms.add(room);
    res.status(200).send({ room });
  } catch (e) {
    res.status(404).send({ error: `Could not get room. ${e}` });
  }
});

router.post("/", async (req, res) => {
  const roomName = req.body.roomName;
  const roomPassword = req.body.roomPassword || "";
  try {
    await rooms.create(roomName, roomPassword);
    res.status(200).send({ success: `Room created: ${roomName}` });
  } catch (e) {
    res.status(409).send({ error: `Could not create room. ${e}` });
  }
});

router.post("/join", async (req, res) => {
  const roomName = req.body.roomName;
  const roomPassword = req.body.roomPassword || "";
  try {
    const room = await rooms.getFromDb(roomName);
    if (room.password !== roomPassword) {
      throw new Error("Incorrect password.");
    }
    res.status(200).send({ success: `Room ${roomName} found, joining...` });
  } catch (e) {
    if ((e as Error).message === "Incorrect password.") {
      res.status(401).send({ error: (e as Error).message });
    } else {
      res.status(404).send({ error: `Could not join room. ${e}` });
    }
  }
});

export default router;
