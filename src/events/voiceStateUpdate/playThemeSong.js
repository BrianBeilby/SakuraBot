const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
const ThemeSong = require("../../models/ThemeSong");

module.exports = async (client, voiceStates) => {
  const oldState = voiceStates[0];
  const newState = voiceStates[1];

  const player = useMasterPlayer();

  // User joined channel
  if (oldState) {
    if (!oldState.member.user.bot) {
      if (oldState.channelId === undefined || oldState.channelId === null) {
        if (newState.channelId !== undefined && newState.channelId !== null) {
          const themeSong = await ThemeSong.findOne({
            userId: oldState.member.user.id,
            guildId: oldState.guild.id,
          });

          try {
            const { track } = await player.play(
              newState.channelId,
              themeSong.song,
              {
                  nodeOptions: {
                    metadata: newState,
                  },
              }
            );

            const embed = new EmbedBuilder()
              .setDescription(
                `✅ **|** Queued: [**${track.title}**](${track.url}).`
              )
              .setColor("Green");

            const channel = client.channels.cache.get(newState.channelId);
            if (channel) {
              channel.send({ embeds: [embed] });
            }
          } catch (error) {
            const embed = new EmbedBuilder()
              .setDescription(`😡 **|** Something went wrong: ${error}`)
              .setColor("Red");

            const channel = client.channels.cache.get(newState.channelId);
            if (channel) {
              channel.send({ embeds: [embed] });
            }
          }
        }
      }
    }
  }
};
