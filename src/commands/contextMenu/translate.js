const { Client, Interaction, EmbedBuilder } = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: "Translate",
  type: "context-menu",
  edited: false,
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetMessage = interaction.targetMessage;

    const translated = await translate(targetMessage.content, { to: "en" });

    const embed = new EmbedBuilder()
      .setTitle(`🔎 Translate Successful`)
      .setColor("Green")
      .addFields({
        name: "Original Text",
        value: `\`\`\`${targetMessage.content}\`\`\``,
        inline: false,
      })
      .addFields({
        name: "Translated Text",
        value: `\`\`\`${translated.text}\`\`\``,
        inline: false,
      });

    interaction.reply({ embeds: [embed] });
  },
};
