const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  name: "pause",
  description: "Pauses the queue!",
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

    queue.node.setPaused(true);

    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Paused the queue.`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  },
};
