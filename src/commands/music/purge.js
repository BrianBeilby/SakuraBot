const { Client, Interaction } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: "purge",
    description: "Removes all songs from the queue!",
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
        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply("There is no song playing!");
        }

        queue.delete();

        return interaction.reply("The queue has been purged.");
    },
};