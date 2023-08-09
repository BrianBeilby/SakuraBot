const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  Client,
  Interaction,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
  name: "translate",
  description: "Translate a message to another language!",
  type: "slash",
  options: [
    {
      name: "message",
      description: "The message you want to translate.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "language",
      description: "The language you want to translate to.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: translate**")
    .setDescription(
      "Translates a message to another language.\nSpecify the message to translate\nand the language to translate to."
    )
    .addFields(
      { name: "**Usage**", value: "`/translate <message> <language>`" },
      { name: "**Example**", value: "`/translate あい english`" }
    ),
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const targetMessage = interaction.options.getString("message", true);
    const targetLanguage = interaction.options.getString("language", true);

    try {
      const translated = await translate(targetMessage, { to: targetLanguage });

      const embed = new EmbedBuilder()
        .setTitle(`🔎 **|** Translate Successful`)
        .setColor("Green")
        .addFields({
          name: "Original Text",
          value: `\`\`\`${targetMessage}\`\`\``,
          inline: false,
        })
        .addFields({
          name: `Translated to ${targetLanguage}`,
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
