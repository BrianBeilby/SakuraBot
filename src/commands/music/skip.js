const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  name: "skip",
  description: "Skips the current song!",
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

    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no song playing!");
    }

    queue.node.skip();

    const track = queue.currentTrack;
    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Skipped: [**${track.title}**](${track.url}).`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  },
};
