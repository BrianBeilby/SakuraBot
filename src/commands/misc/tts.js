const {
  EmbedBuilder,
  PermissionsBitField,
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "tts",
  description: "Sends a text to speech message!",
  type: "slash",
  options: [
    {
      name: "message",
      description: "The message you want to send.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: tts**")
    .setDescription(
      "Send a text to speech message.\nRequires the `SEND_TTS_MESSAGES` permission."
    )
    .addFields(
      { name: "**Usage**", value: "`/tts <message>`" },
      { name: "**Example**", value: "`/tts hello`" }
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
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.SendTTSMessages
      )
    )
      return interaction.reply({
        content: "You do not have the `SEND_TTS_MESSAGES` permission.",
        ephemeral: true,
      });

    const { options } = interaction;
    const message = options.getString("message", true);

    await interaction.reply({ content: `${message}`, tts: true });
  },
};
