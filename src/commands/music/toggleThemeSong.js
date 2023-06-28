const { Client, Interaction, EmbedBuilder } = require("discord.js");
const ThemeSong = require("../../models/ThemeSong");

module.exports = {
  name: "toggle-theme-song",
  description: "Toggles the user's theme song feature between on and off!",
  type: "slash",
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
    const themeSong = await ThemeSong.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    await interaction.deferReply();

    if (!themeSong) {
      // If the user doesn't have a theme song set
      const embed = new EmbedBuilder()
        .setDescription(
          `❌ **|** You don't have a theme song set! Use \`/set-theme-song\` to set one!`
        )
        .setColor("Red");

      return interaction.editReply({ embeds: [embed] });
    } else {
      themeSong.status = !themeSong.status;
      await themeSong.save();

      const embed = new EmbedBuilder()
        .setDescription(
          `✅ **|** The status of ${interaction.user}'s theme song is now ${themeSong.status}.`
        )
        .setColor("Green");

        return interaction.editReply({ embeds: [embed] });
    }
  },
};
