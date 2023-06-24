const { Client, Interaction } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: "queue",
    description: "Displays the queue!",
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

        const tracks = queue.tracks.toArray();
        console.log(tracks);
    },
};