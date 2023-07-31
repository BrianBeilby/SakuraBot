const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  name: "queue",
  description: "Displays the queue!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: queue**")
    .setDescription("Displays the music queue.")
    .addFields(
      { name: "**Usage**", value: "`/queue`" },
      { name: "**Example**", value: "`/queue`" }
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
    try {
      const queue = useQueue(interaction.guild.id);
      if (!queue) return interaction.reply("There is nothing in the queue!");
      const tracks = queue.tracks.toArray();
      if (tracks.length === 0)
        return interaction.reply("There is nothing in the queue!");

      const songsPerPage = 10;
      const pages = Math.ceil(tracks.length / songsPerPage);
      let pageIndex = parseInt(interaction.options.get("page")?.value) || 1;

      if (pageIndex < 1 || pageIndex > pages)
        return interaction.reply("Invalid page number.");

      const startIdx = (pageIndex - 1) * songsPerPage;
      const endIdx = startIdx + songsPerPage;
      const currentPageTracks = tracks.slice(startIdx, endIdx);

      // iterate through the tracks array and add each track's title and url to a fieldValue
      let fieldValue = "";
      for (let i = 0; i < currentPageTracks.length; i++) {
        fieldValue += `**${i + startIdx + 1}.** [**${
          currentPageTracks[i].title
        }**](${currentPageTracks[i].url})\n`;
      }

      const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("🎶 **|** Queue")
        .setDescription(
          `**Currently Playing:** [**${queue.currentTrack.title}**](${queue.currentTrack.url}).`
        )
        .addFields({
          name: "\u200b",
          value: fieldValue,
          inline: false,
        });

      const previousButton = new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("⬅️")
        .setStyle("Primary")
        .setDisabled(pageIndex === 1);

      const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle("Primary")
        .setDisabled(pageIndex === pages);

      const navigationRow = new ActionRowBuilder().addComponents(
        previousButton,
        nextButton
      );

      const reply = await interaction.reply({
        embeds: [embed],
        components: [navigationRow],
      });

      const filter = (i) => i.user.id === interaction.user.id;
      const collector = reply.createMessageComponentCollector({
        filter,
        time: 60000,
      }); // 60 seconds timeout

      collector.on("collect", async (buttonInteraction) => {
        if (buttonInteraction.customId === "previous") {
          pageIndex--;
        } else if (buttonInteraction.customId === "next") {
          pageIndex++;
        }

        // Update the previous and next buttons' 'disabled' property based on the new 'pageIndex'
        previousButton.setDisabled(pageIndex === 1);
        nextButton.setDisabled(pageIndex === pages);

        if (pageIndex < 1 || pageIndex > pages) return;

        // Update the embed with the new page
        const startIdx = (pageIndex - 1) * songsPerPage;
        const endIdx = startIdx + songsPerPage;
        const currentPageTracks = tracks.slice(startIdx, endIdx);

        let fieldValue = "";
        for (let i = 0; i < currentPageTracks.length; i++) {
          fieldValue += `**${i + startIdx + 1}.** [**${
            currentPageTracks[i].title
          }**](${currentPageTracks[i].url})\n`;
        }

        const updatedEmbed = new EmbedBuilder(embed).spliceFields(0, 1, {
          name: "\u200b",
          value: fieldValue,
        });

        await buttonInteraction.update({
          embeds: [updatedEmbed],
          components: [navigationRow],
        });
      });

      collector.on("end", (_, reason) => {
        if (reason === "time") {
          // If the collector ends due to timeout, remove the buttons
          const navigationRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previous")
              .setEmoji("⬅️")
              .setStyle("Primary")
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("next")
              .setEmoji("➡️")
              .setStyle("Primary")
              .setDisabled(true)
          );

          reply.edit({ components: [navigationRow] });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
};
