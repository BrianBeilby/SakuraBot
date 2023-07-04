const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    const targetRoleId = interaction.options.get("role").value;

    try {
      await interaction.deferReply();

      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        if (autoRole.roleId === targetRoleId) {
          interaction.editReply(
            "Auto role has already been configured to that role. To disable run `/autorole-disable`."
          );
          return;
        }

        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        });
      }

      await autoRole.save();
      interaction.editReply(
        "Autorole has now been configured. To disable run `/autorole-disable`."
      );
    } catch (error) {
      console.log(error);
    }
  },

  name: "autorole-configure",
  description: "Configure the autorole for the server.",
  type: "slash",
  options: [
    {
      name: "role",
      description: "The role to give to new members.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  embed: new EmbedBuilder()
    .setTitle("**Command: autorole-configure**")
    .setDescription("Configure the autorole for the server.\nNew members will be given the role specified.")
    .addFields(
      { name: "**Usage**", value: "`/autorole-configure <role>`" },
      { name: "**Example**", value: "`/autorole-configure @Member`" }
    ),

  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
