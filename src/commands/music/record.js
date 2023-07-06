const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { EndBehaviorType, createAudioResource } = require("@discordjs/voice");
const { useMainPlayer } = require("discord-player");
const path = require("path");
const { createWriteStream } = require("fs");

module.exports = {
  name: "record",
  description: "Records your voice!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: record**")
    .setDescription(
      "Records your audio output assuming you're connected to a voice channel.\nRecording stops when you stop talking."
    )
    .addFields(
      { name: "**Usage**", value: "`/record`" },
      { name: "**Example**", value: "`/record`" }
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
    const player = useMainPlayer();
    const queue = player.nodes.create(interaction.guildId);
    await interaction.deferReply();
    console.log(__dirname);

    try {
      // make sure to connect to a voice channel which you want to record audio from
      await queue.connect(interaction.member.voice.channelId, {
        deaf: false, // make sure self deaf is false otherwise bot wont hear your audio
      });
    } catch {
      return interaction.editReply("Failed to connect to your channel");
    }

    // // initialize receiver stream
    // const stream = queue.voiceReceiver.recordUser(interaction.member.id, {
    //   mode: "pcm", // record in pcm format
    //   end: EndBehaviorType.AfterSilence, // stop recording once user stops talking
    // });

    // const writer = stream.pipe(
    //   createWriteStream(`./assets/audio/recording-${interaction.member.id}.pcm`)
    // ); // write the stream to a file

    // writer.once("finish", () => {
    //   if (interaction.isRepliable())
    //     interaction.editReply(`Finished writing audio!`);
    //   //queue.delete(); // cleanup
    //   const resource = createAudioResource(`./assets/audio/recording-${interaction.member.id}.pcm`);
    //   queue.node.playRaw(resource);
    // });

    const resource = createAudioResource(path.join(__dirname, 'recording-136273361910235136.pcm'));
    queue.node.playRaw(resource);
  },
};
