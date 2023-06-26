const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  const queue = useQueue(interaction.guild.id);

  if (interaction.customId === "skip") {
    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no song playing!");
    }

    queue.node.skip();

    const track = queue.currentTrack;
    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Skipped: [**${track.title}**](${track.url}).`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  }

  if (interaction.customId === "pause") {
    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no song playing!");
    }

    queue.node.setPaused(true);

    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Paused the queue.`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  }

  if (interaction.customId === "resume") {
    if (!queue || !queue.isPlaying()) {
      return interaction.reply("There is no song playing!");
    }

    queue.node.setPaused(false);

    const embed = new EmbedBuilder()
      .setDescription(`✅ **|** Resumed the queue.`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  }
};
