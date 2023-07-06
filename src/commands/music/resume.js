const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  name: "resume",
  description: "Resumes the queue!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: resume**")
    .setDescription("Resumes the music queue.")
    .addFields(
      { name: "**Usage**", value: "`/resume`" },
      { name: "**Example**", value: "`/resume`" }
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

    queue.node.setPaused(false);

    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Resumed the queue.`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  },
};
