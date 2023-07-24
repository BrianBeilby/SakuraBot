const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: "Translate",
  description: "Translate a sent message to English!",
  type: "context-menu",
  edited: false,
  embed: new EmbedBuilder()
    .setTitle("**Context Menu Command: translate**")
    .setDescription(
      "Context menu command to translate a message.\nSimply right click a message and click `Translate`\nto translate the message to English."
    ),
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
    await interaction.deferReply();

    const targetMessage = interaction.targetMessage;

    try {
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

      const speakOriginal = new ButtonBuilder()
        .setCustomId("speakOriginal")
        .setLabel("🔊 Original")
        .setStyle("Primary");

      const speakTranslated = new ButtonBuilder()
        .setCustomId("speakTranslated")
        .setLabel("🔊 Translated")
        .setStyle("Primary");

      const row = new ActionRowBuilder().addComponents(
        speakOriginal,
        speakTranslated
      );

      interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle(`❌ Translation Error`)
        .setColor("Red")
        .setDescription(
          `An error occurred while translating the text: \`${error.message}\``
        );
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
