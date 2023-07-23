const {
  EmbedBuilder,
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const langdetect = require("langdetect");
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
  options: [
    {
      name: "message",
      description: "The message you want spoken aloud.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
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

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const userMessage = interaction.options.getString("message", true);
      const lang = langdetect.detect(userMessage);
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

      const embed = new EmbedBuilder()
        .setDescription(
          `✅ **|** The message was successfully spoken in the voice channel!`
        )
        .setColor("Green");

      // Send a success message after the player is subscribed
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setDescription(`😡 **|** Something went wrong: ${error}`)
        .setColor("Red");

      // Send an error message if something goes wrong
      interaction.editReply({ embeds: [embed] });
    }
  },
};
