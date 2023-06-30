const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const ThemeSong = require("../../models/ThemeSong");
const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "set-theme-song",
  description: "Sets the theme song for the specified user!",
  type: "slash",
  options: [
    {
      name: "user",
      description: "The user you want to set the theme song for.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "song",
      description: "The song you want to set as the theme song.",
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
    const user = interaction.options.getUser("user", true);
    const song = interaction.options.getString("song", true);
    const player = useMainPlayer();

    await interaction.deferReply();
    const searchResult = await player.search(song, {
      requestedBy: interaction.user,
    });

    if (!searchResult.hasTracks()) {
      // If player didn't find any songs for this query
      await interaction.editReply(`We found no tracks for ${song}!`);
      return;
    } else {
      try {
        // get the track from the search result
        const track = searchResult.tracks[0];

        const themeSong = await ThemeSong.findOne({
          userId: user.id,
          guildId: interaction.guild.id,
        });

        if (themeSong) {
          themeSong.song = track.url;
          await themeSong.save();
        } else {
          await ThemeSong.create({
            userId: user.id,
            guildId: interaction.guild.id,
            song: track.url,
            status: true,
          });
        }

        const embed = new EmbedBuilder()
          .setDescription(
            `✅ **|** Set ${user}'s theme song to [**${track.title}**](${track.url}).`
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
