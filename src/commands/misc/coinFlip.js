const { EmbedBuilder, Client, Interaction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "coinflip",
  description: "Flips a coin!",
  type: "slash",
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: coinflip**")
    .setDescription("Flips a coin and returns either heads or tails.")
    .addFields(
      { name: "**Usage**", value: "`/coinflip`" },
      { name: "**Example**", value: "`/coinflip`" }
    ),
  // devOnly: Boolean,
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean,

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const headsEmbed = new EmbedBuilder()
      .setDescription("Heads!")
      .setColor("Green");
    const tailsEmbed = new EmbedBuilder()
      .setDescription("Tails!")
      .setColor("Red");

    const heads = Math.random() < 0.5;

    const flipAgainButton = new ButtonBuilder()
      .setCustomId("flip_again")
      .setLabel("Flip Again")
      .setStyle("Primary");

    const actionRow = new ActionRowBuilder().addComponents(flipAgainButton);

    if (heads) {
      interaction.editReply({ embeds: [headsEmbed], components: [actionRow] });
    } else {
      interaction.editReply({ embeds: [tailsEmbed], components: [actionRow] });
    }

    const filter = (interaction) =>
      interaction.customId === "flip_again" &&
      interaction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (collected) => {
      const newHeads = Math.random() < 0.5;
      if (newHeads) {
        await collected.update({
          embeds: [headsEmbed],
          components: [actionRow],
        });
      } else {
        await collected.update({
          embeds: [tailsEmbed],
          components: [actionRow],
        });
      }
    });

    collector.on("end", () => {
      actionRow.components[0].setDisabled(true);
      interaction.editReply({ components: [actionRow] });
    });
  },
};
