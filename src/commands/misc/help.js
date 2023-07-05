const getLocalCommands = require("../../utils/getLocalCommands");
const {
  Client,
  Interaction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  userMention,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Provides information about the bot!",
  type: "slash",
  edited: false,
  embed: new EmbedBuilder()
    .setTitle("**Command: help**")
    .setDescription("This is a command that supports two subcommands: `overview` and `commands`.\nThe `overview` subcommand shows useful information about the bot itself.\nThe `commands` subcommand shows information about a specific command.")
    .addFields(
      { name: "**Usage**", value: "`/help overview\n/help commands <command>`" },
      { name: "**Example**", value: "`/help overview\n/help commands play\n/help commands queue`" }
    ),
  options: [
    {
      name: "overview",
      description: "Provides an overview!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "commands",
      description: "Get help with commands!",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "command",
          description: "The command you want to get help with!",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
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
    const subcommand = interaction.options.getSubcommand();
    const command = interaction.options.getString("command");

    switch (subcommand) {
      case "overview":
        const embed = new EmbedBuilder()
          .setTitle("📜 Help")
          .setColor("Blue")
          .setFooter({
            text: "SakuraBot v1.0.0",
            iconURL:
              "https://i.imgur.com/jfW4cn6_d.jpg?maxwidth=520&shape=thumb&fidelity=high",
          })
          .setDescription(
            "Welcome to the help menu! Here you can learn about the bot and its commands!"
          )
          .addFields(
            {
              name: "Commands",
              value: `To get help with commands, use \`/help commands\`!`,
            },
            { name: "Support", value: `To get support, just ask Brian!` },
            {
              name: "Invite",
              value: `To invite the bot to your server, use [this link](https://discord.com/api/oauth2/authorize?client_id=1119368678635475026&permissions=8&scope=bot%20applications.commands)!`,
            },
            {
              name: "Source",
              value: `To view the source code, go to [this repository](https://github.com/BrianBeilby/SakuraBot)!`,
            }
          );

        interaction.reply({ embeds: [embed], ephemeral: true });
        break;

      case "commands":
        const command = interaction.options.getString("command");
        const commands = getLocalCommands();
        const commandInfo = commands.find((cmd) => cmd.name === command);

        if (!commandInfo) {
          interaction.reply({
            content: `The command \`${command}\` does not exist! Commands are case sensitive!`,
            ephemeral: true,
          });
          return;
        }

        switch (commandInfo.name) {
          case "balance":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/balance\n/balance ${userMention(interaction.member.id)}`,
            });
            break;
          case "level":
            commandInfo.embed.addFields({
              name: "**Example**",
              value: `/level\n/level ${userMention(interaction.member.id)}`,
            });
            break;
          default:
            break;
        }

        interaction.reply({ embeds: [commandInfo.embed], ephemeral: true });
        break;

      default:
        // Code for handling an invalid subcommand
        break;
    }
  },
};
