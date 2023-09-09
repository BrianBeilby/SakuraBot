const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "play",
  description: "Plays a song!",
  type: "slash",
  options: [
    {
      name: "query",
      description: "The song name/url you want to play.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: play**")
    .setDescription("Plays a user specified song!")
    .addFields(
      { name: "**Usage**", value: "`/play <song name/url>`" },
      { name: "**Example**", value: "`/play Mr. Rager`" }
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
    const player = useMainPlayer();
    const channel = interaction.member.voice.channel;

    if (!channel)
      return interaction.reply("You are not connected to a voice channel!");
    const query = interaction.options.getString("query", true);

    await interaction.deferReply();
    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
    });

    if (!searchResult.hasTracks()) {
      // If player didn't find any songs for this query
      await interaction.editReply(`We found no tracks for ${query}!`);
      return;
    } else {
      try {
        const { track } = await player.play(channel, searchResult, {
          nodeOptions: {
            metadata: interaction,
            leaveOnEnd: false,
          },
        });

        const embed = new EmbedBuilder()
          .setDescription(
            `✅ **|** Queued: [**${track.title}**](${track.url}).`
          )
          .setColor("Green");

        return interaction.editReply({ embeds: [embed] });
      } catch (error) {
        const embed = new EmbedBuilder()
          .setDescription(`😡 **|** Something went wrong: ${error}`)
          .setColor("Red");

        return interaction.followUp({ embeds: [embed] });
      }
    }
  },
};