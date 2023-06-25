const path = require("path");
const getAllFiles = require("../utils/getAllFiles");
const { useMasterPlayer } = require("discord-player");

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);
  const player = useMasterPlayer();

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });

    player.events.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(player, arg);
      }
    });
  }
};
