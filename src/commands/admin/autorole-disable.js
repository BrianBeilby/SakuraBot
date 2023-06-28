const { Client, InteractionCollector, PermissionFlagsBits } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            if (!await AutoRole.exists({ guildId: interaction.guild.id })) {
                interaction.editReply("Autorole has not been configured yet. To configure run `/autorole-configure`.");
                return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });

            interaction.editReply("Autorole has been disabled for this server. Use `/autorole-configure` to re-enable it");
        } catch (error) {
            console.log(error);
        }
    },

    name: "autorole-disable",
    description: "Disables the autorole feature for the server.",
    permissionsRequired: [PermissionFlagsBits.Administrator],
};