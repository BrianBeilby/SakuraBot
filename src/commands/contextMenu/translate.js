const { Client, Interaction } = require('discord.js');

module.exports = {
    name: "Translate",
    type: "context-menu",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,
  
    callback: (client, interaction) => {
      const targetMessage = interaction.targetMessage;
      console.log(targetMessage);
    },
  };