const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useMasterPlayer } = require("discord-player");
const { useQueue } = require("discord-player");
const ThemeSong = require("../../models/ThemeSong");
const cooldowns = new Set();

module.exports = async (client, voiceStates) => {
  const oldState = voiceStates[0];
  const newState = voiceStates[1];

  const player = useMasterPlayer();

  // User joined channel
  if (oldState && !cooldowns.has(oldState.member.user.id)) {
    if (!oldState.member.user.bot) {
      if (oldState.channelId === undefined || oldState.channelId === null) {
        if (newState.channelId !== undefined && newState.channelId !== null) {
          const channel = client.channels.cache.get(newState.channelId);
          const themeSong = await ThemeSong.findOne({
            userId: oldState.member.user.id,
            guildId: oldState.guild.id,
          });

          if (!themeSong || !themeSong.status) return;

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

            const queue = useQueue(oldState.guild.id);

            // Stop the player after 10 seconds
            setTimeout(() => {
              queue.node.skip();
            }, 10000);

            const embed = new EmbedBuilder()
              .setDescription(
                `✅ **|** Queued: [**${track.title}**](${track.url}).`
              )
              .setColor("Green");

            if (channel) {
              channel.send({ embeds: [embed] });
            }

            cooldowns.add(oldState.member.user.id);
            setTimeout(() => {
              cooldowns.delete(oldState.member.user.id);
            }, 4.32e7);
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
