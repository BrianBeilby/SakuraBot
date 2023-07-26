const { Client, Interaction, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const langdetect = require("langdetect");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
  AudioPlayerStatus,
} = require("@discordjs/voice");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  interaction = interaction[0];
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

  if (interaction.customId === "speakOriginal") {
    const userMessage = interaction.message.embeds[0].fields[0].value.replace(
      /`/g,
      ""
    ); // remove all backticks
    const lang = langdetect.detect(userMessage);
    if (!lang) return interaction.reply("Language not detected!");

    const gtts = require("node-gtts")(lang[0].lang);
    const stream = gtts.stream(userMessage);

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply("You are not connected to a voice channel!");
    }

    const queue = useQueue(channel.guild.id);
    if (queue) {
      queue.delete();
    }

    const player = createAudioPlayer();
    player.play(resource);

    player.on("error", (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.metadata}`
      );
      throw error;
    });

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.subscribe(player);

    interaction.reply({
      content: "Playing original message...",
      ephemeral: true,
    });
  }

  if (interaction.customId === "speakTranslated") {
    const userMessage = interaction.message.embeds[0].fields[1].value.replace(
      /`/g,
      ""
    ); // remove all backticks
    const lang = langdetect.detect(userMessage);
    if (!lang) return interaction.reply("Language not detected!");

    const gtts = require("node-gtts")(lang[0].lang);
    const stream = gtts.stream(userMessage);

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply("You are not connected to a voice channel!");
    }

    const queue = useQueue(channel.guild.id);
    if (queue) {
      queue.delete();
    }

    const player = createAudioPlayer();
    player.play(resource);

    player.on("error", (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.metadata}`
      );
      throw error;
    });

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.subscribe(player);

    interaction.reply({
      content: "Playing translated message...",
      ephemeral: true,
    });
  }
};
