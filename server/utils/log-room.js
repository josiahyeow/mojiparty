function logRoom(room) {
  const lobbyPlayers =
    room.players &&
    Object.keys(room.players).map(
      (playerId) =>
        ` ${room.players[playerId].emoji} ${room.players[playerId].name}`
    );
  const gamePlayers =
    room.players &&
    Object.keys(room.players).map(
      (playerId) =>
        ` ${room.players[playerId].emoji} ${room.players[playerId].name} - ${room.players[playerId].score}, ${room.players[playerId].pass}`
    );
  if (!room.game) {
    console.log(
      `[${room.name}] | lobby | ${
        room.lastEvent && room.lastEvent.type
      } | players:${lobbyPlayers} | ${
        room.settings && room.settings.scoreLimit
      }, ${Object.values(room.settings && room.settings.selectedCategories)
        .filter((category) => category.include === true)
        .map((category) => category.name)}`
    );
  } else {
    console.log(
      `[${room.name}] | game | ${
        room.game.lastEvent.type
      } | players: ${gamePlayers} | ${JSON.stringify(
        room.game.currentEmojiSet
      )}`
    );
    if (room.game.winners) {
      console.log(`[${room.name}] | game | finished | players:${gamePlayers}`);
    }
  }
}

module.exports = logRoom;
