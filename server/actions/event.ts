import { get, update } from "../actions/rooms";

function updateGameEvent(roomName: string, event: string) {
  const room = get(roomName);
  if (!room) return;
  if (!room?.game) {
    room.lastEvent = { type: event };
  } else {
    room.game.lastEvent = { type: event };
  }
  update(room);
}

export { updateGameEvent };
