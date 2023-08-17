const { useQueue, useMainPlayer } = require("discord-player");
const isVoiceEmpty = require("../../utils/isVoiceEmpty");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, voiceStates) => {
  const oldState = voiceStates[0];
  const newState = voiceStates[1];
  const player = useMainPlayer();

  if (oldState) {
    try {
      const queue = useQueue(oldState.guild.id);

      if (
        queue &&
        !newState.channelId &&
        oldState.channelId === queue.channel.id
      ) {
        if (!isVoiceEmpty(queue.channel)) return;
        if (!player.nodes.has(queue.guild.id)) return;

        if (queue.timeout) {
          clearTimeout(queue.timeout);
          queue.timeout = null;
        }

        queue.timeout = setTimeout(() => {
          const embed = new EmbedBuilder()
            .setDescription(`👋 **|** Left voice channel due to inactivity.`)
            .setColor("Red");

          queue.metadata.channel.send({ embeds: [embed] });
          queue.delete();
        }, 15000);
      } else if (
        queue &&
        newState.channelId &&
        newState.channelId === queue.channel.id
      ) {
        if (queue.timeout) {
          clearTimeout(queue.timeout);
          queue.timeout = null;
        }
      }
    } catch (error) {
      console.log(`😡 Error: ${error}`);
    }
  }
};
