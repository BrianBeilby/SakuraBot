const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    name: "queue",
    description: "Displays the queue!",
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
        const queue = useQueue(interaction.guild.id);
        if (!queue) return interaction.reply("There is nothing in the queue!");

        const tracks = queue.tracks.toArray();

        // iterate through the tracks array and add each track's title and url to a fields array
        const fields = [];
        for (let i = 0; i < tracks.length; i++) {
            fields.push({
                name: '\u200b',
                value: `**${i + 1}:** [${tracks[i].title}](${tracks[i].url}).`,
            });
        }

        const embed = {
            color: 0x800080,
            title: "🎶 **|** Queue",
            description: `**Currently Playing:** [**${queue.currentTrack.title}**](${queue.currentTrack.url}).`,
            fields: fields,
        };

        return interaction.reply({ embeds: [embed] });
    },
};