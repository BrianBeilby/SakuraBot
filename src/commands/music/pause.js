const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  name: "pause",
  description: "Pauses the queue!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: pause**")
    .setDescription("Puts the music queue on pause.")
    .addFields(
      { name: "**Usage**", value: "`/pause`" },
      { name: "**Example**", value: "`/pause`" }
    ),
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
