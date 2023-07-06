const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    const targetUserId =
      interaction.options.get("user")?.value || interaction.member.id;

    await interaction.deferReply();

    const user = await User.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!user) {
      interaction.editReply("`<@${targetUserId}>` doesn't have a profile yet.");
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id
        ? `Your balance is **${user.balance}**!`
        : `<@${targetUserId}>'s balance is **${user.balance}**!`
    );
  },

  name: "balance",
  description: "See your/someone else's balance.",
  type: "slash",
  options: [
    {
      name: "user",
      description: "The user you want to see the balance of.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Slash Command: balance**")
    .setDescription("Shows either your balance or someone else's balance!")
    .addFields(
      { name: "**Usage**", value: "`/balance\n/balance <user>`" },
    ),
};
