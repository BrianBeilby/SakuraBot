const { Client, Interaction, ActionRowBuilder } = require("discord.js");
const getCommandByName = require("../../utils/getCommandByName");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = (client, interaction) => {
  interaction = interaction[0];
  const commandObject = getCommandByName(interaction.commandName);
  //console.log(commandObject.level2Button);
  if (!interaction.isButton()) return;

  if (interaction.customId === "level2") {
    console.log(commandObject);
    const row2 = new ActionRowBuilder().addComponents(commandObject.level2Button);
    interaction.update({
      embeds: [commandObject.embedLevel2],
      //components: [row2],
    });
  }

  if (interaction.customId === "level3") {
    interaction.update({
      embeds: [commandObject.embedLevel3],
    });
  }
};
