const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Replies with the bot's ping!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: ping**")
    .setDescription("Shows the bots latency time.")
    .addFields(
      { name: "**Usage**", value: "`/ping`" },
      { name: "**Example**", value: "`/ping`" }
    ),
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean,

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`
    );
  },
};
