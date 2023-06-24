const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const { useMasterPlayer } = require("discord-player");

module.exports = {
  name: "play",
  description: "Plays a song!",
  options: [
    {
      name: "query",
      description: "The song name/url you want to play.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const player = useMasterPlayer();
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
          },
        });

        return interaction.editReply(`**${track.title}** enqueued!`);
      } catch (error) {
        return interaction.followUp(`😡 Something went wrong: ${error}`);
      }
    }
  },
};
