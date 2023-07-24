const {
  EmbedBuilder,
  Client,
  Interaction,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const langdetect = require("langdetect");
const translate = require("@iamtraction/google-translate");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "speak",
  description: "Speak a message!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: speak**")
    .setDescription("Send a TTS(Text to Speech) message.\nThe spoken message will be played in the voice channel you are in.\nInput your desired message into the modal that appears after\nexecuting the command.")
    .addFields(
      { name: "**Usage**", value: "`/speak`" },
      { name: "**Example**", value: "`/speak`" }
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
    const modal = new ModalBuilder()
      .setCustomId(`ttsModal-${interaction.user.id}`)
      .setTitle("Text to Speech Input");

    const textInput = new TextInputBuilder()
      .setCustomId("textInput")
      .setLabel("Enter your message here.")
      .setPlaceholder("Enter your message here.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(textInput);

    modal.addComponents(actionRow);
    await interaction.showModal(modal);

    const filter = (interaction) =>
      interaction.customId === `ttsModal-${interaction.user.id}`;

    interaction
      .awaitModalSubmit({ filter, time: 60000 })
      .then(async (modalInteraction) => {
        const userMessage =
          modalInteraction.fields.getTextInputValue("textInput");
        const lang = langdetect.detect(userMessage);
        if (!lang) return modalInteraction.reply("Language not detected!");

        const gtts = require("node-gtts")(lang[0].lang);

        const stream = gtts.stream(userMessage);

        const resource = createAudioResource(stream, {
          inputType: StreamType.Arbitrary,
        });

        const player = createAudioPlayer();

        player.play(resource);

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
        });

        player.on("error", (error) => {
          console.error(
            `Error: ${error.message} with resource ${error.resource.metadata}`
          );
          throw error;
        });

        const channel = interaction.member.voice.channel;
        if (!channel) {
          return interaction.reply("You are not connected to a voice channel!");
        }

        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });

        connection.subscribe(player);

        const translated = await translate(userMessage, { to: "en" });

        const embed = new EmbedBuilder()
          .setTitle(`🔊 **|** Text to Speech Successful!`)
          .setColor("Green")
          .addFields({
            name: "Original Text",
            value: `\`\`\`${userMessage}\`\`\``,
            inline: false,
          });

        if (lang[0].lang !== "en") {
          embed.addFields({
            name: "Translated Text",
            value: `\`\`\`${translated.text}\`\`\``,
            inline: false,
          });
        }

        // Send a success message after the player is subscribed
        modalInteraction.reply({ embeds: [embed] });
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
