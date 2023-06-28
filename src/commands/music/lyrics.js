const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { lyricsExtractor } = require("@discord-player/extractor");
const { useQueue } = require("discord-player");

module.exports = {
  name: "lyrics",
  description: "Displays the lyrics of the current song!",
  type: "slash",
  // options: Object[],
  // devOnly: Boolean,
  // testOnly: Boolean,
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id);
    const track = queue.currentTrack;
    const lyricsFinder = lyricsExtractor();

    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no song playing!");
    }

    const lyrics = await lyricsFinder.search(track.title).catch(() => null);
    if (!lyrics)
      return interaction.followUp({
        content: "No lyrics found",
        ephemeral: true,
      });

    const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setTitle(lyrics.title)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setAuthor({
        name: lyrics.artist.name,
        iconURL: lyrics.artist.image,
        url: lyrics.artist.url,
      })
      .setDescription(
        trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
      )
      .setColor("Yellow");

    return interaction.editReply({ embeds: [embed] });
  },
};
