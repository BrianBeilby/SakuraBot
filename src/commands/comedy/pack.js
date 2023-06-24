const insulter = require('insult');
const { Client, Interaction } = require('discord.js');

module.exports = {
    name: "pack",
    description: "Boutta pack you real quick!",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,
  
    callback: (client, interaction) => {
      interaction.reply(insulter.Insult());
    },
  };