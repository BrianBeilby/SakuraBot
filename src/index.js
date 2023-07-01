require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");
const { Player } = require("discord-player");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

const process = require("node:process");

process.on("unhandledRejection", async (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", async (error) => {
  console.log("Uncaught Exception:", error);
});

process.on("uncaughtExceptionMonitor", async (error, origin) => {
  console.log("Uncaught Exception Monitor:", error, origin);
});

(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true });
    console.log("✅ Connected to DB!");

    // this is the entrypoint for discord-player based application
    const player = new Player(client);

    // This method will load all the extractors from the @discord-player/extractor package
    await player.extractors.loadDefault();

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`😡 Error: ${error}`);
  }
})();
