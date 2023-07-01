const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const ThemeSong = require("../../models/ThemeSong");

module.exports = async (client, voiceStates) => {
  const oldState = voiceStates[0];
  const newState = voiceStates[1];

  const player = useMainPlayer();

  // User joined channel
  if (oldState) {
    if (!oldState.member.user.bot) {
      if (oldState.channelId === undefined || oldState.channelId === null) {
        if (newState.channelId !== undefined && newState.channelId !== null) {
          const channel = client.channels.cache.get(newState.channelId);
          const themeSong = await ThemeSong.findOne({
            userId: oldState.member.user.id,
            guildId: oldState.guild.id,
          });

          if (!themeSong || !themeSong.status) return;

          const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

          if (
            themeSong.timeLastPlayed &&
            themeSong.timeLastPlayed > twelveHoursAgo
          ) {
            return;
          }

          try {
            const { track } = await player.play(
              newState.channelId,
              themeSong.song,
              {
                nodeOptions: {
                  metadata: newState,
                  leaveOnEnd: false,
                },
              }
            );

            track.isThemeSong = true;

            const embed = new EmbedBuilder()
              .setDescription(
                `✅ **|** Queued: [**${track.title}**](${track.url}).`
              )
              .setColor("Green");

            if (channel) {
              channel.send({ embeds: [embed] });
            }

            themeSong.timeLastPlayed = new Date();
            await themeSong.save();
          } catch (error) {
            const embed = new EmbedBuilder()
              .setDescription(`😡 **|** Something went wrong: ${error}`)
              .setColor("Red");

            if (channel) {
              channel.send({ embeds: [embed] });
            }
          }
        }
      }
    }
  }
};
