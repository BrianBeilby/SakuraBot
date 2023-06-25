const { useQueue} = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = (client, interaction) => {
    const queue = useQueue(interaction.guild.id);
    const track = queue.currentTrack;
    
    const embed = new EmbedBuilder()
          .setColor('Purple')
          .setThumbnail(track.raw.thumbnail)
          .addFields(
            { name: "Title", value: track.title, inline: true },
            { name: "Artist", value: track.author, inline: true },
            { name: "Duration", value: track.duration, inline: true },
          );

          queue.metadata.channel.send({ embeds: [embed] });
};