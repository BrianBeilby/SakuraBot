const insulter = require("insult");
const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pack",
  description: "Boutta pack you real quick!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: pack**")
    .setDescription("Generates a random insult.")
    .addFields(
      { name: "**Usage**", value: "`/pack`" },
      { name: "**Example**", value: "`/pack`" }
    ),
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean,

  callback: (client, interaction) => {
    interaction.reply(insulter.Insult());
  },
};
