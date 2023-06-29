const getLocalCommands = require("../../utils/getLocalCommands");
const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Provides information about the bot's commands!",
    type: "slash",
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
        const localCommands = getLocalCommands();
      
        const fields = [];
      
        for (const command of localCommands) {
          const { name, description, options, type, testOnly } = command;
      
          if (testOnly) continue;
      
          const field = {
            name: type === "slash" ? `📜 Command: ${name}` : `📜 Context Menu Command: ${name}`,
            value: `**Description:** ${description}\n**Options:** ${options ? options.map((option) => `\`${option.name}\``).join(", ") : "None"}`,
            inline: false,
          };
      
          fields.push(field);
        }
      
        const embed = new EmbedBuilder()
          .setTitle("📜 List of Commands")
          .setColor("Green")
          .addFields(fields);
      
        interaction.reply({ embeds: [embed], ephemeral: true });
      },
  };
  