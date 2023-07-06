const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  name: "purge",
  description: "Removes all songs from the queue!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: purge**")
    .setDescription("Removes all songs from the music queue.")
    .addFields(
      { name: "**Usage**", value: "`/purge`" },
      { name: "**Example**", value: "`/purge`" }
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

    queue.delete();

    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Purged the queue.`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  },
};
