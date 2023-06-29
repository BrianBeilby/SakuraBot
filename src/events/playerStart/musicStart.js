const { useQueue } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = (client, interaction) => {
  const queue = useQueue(interaction.guild.id);
  const track = queue.currentTrack;
  const isThemeSong = track?.isThemeSong;

  const embed = new EmbedBuilder()
    .setDescription(`🎶 **|** **Now Playing:** ${track.title}`)
    .setColor("Purple")
    .setImage(track.thumbnail || client.user.displayAvatarURL())
    .addFields(
      { name: "Artist", value: track.author, inline: true },
      { name: "Duration", value: track.duration, inline: true }
    );

  const skip = new ButtonBuilder()
    .setCustomId("skip")
    .setLabel("Skip")
    .setStyle("Primary");

  const pause = new ButtonBuilder()
    .setCustomId("pause")
    .setLabel("Pause")
    .setStyle("Danger");

  const resume = new ButtonBuilder()
    .setCustomId("resume")
    .setLabel("Resume")
    .setStyle("Success");

  const row = new ActionRowBuilder().addComponents(skip, pause, resume);

  queue.metadata.channel.send({ embeds: [embed], components: [row] });

  if (isThemeSong) {
    // Stop the player after 10 seconds
    setTimeout(() => {
      queue.node.skip();
    }, 10000);
  }
};
